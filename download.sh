#! /bin/bash
set -eo pipefail

API_BASE="https://hacker-news.firebaseio.com/v0"
HTML_BASE="https://news.ycombinator.com"

if [ -z $HN_COOKIE ]; then
  echo "You need to set HN_COOKIE using a cookie pulled from your browser after logging into news.ycombinator.com"
  exit 1
fi
username=$(echo $HN_COOKIE | sed 's/^user=\(.*\)&.*$/\1/')
echo "Getting data for $username"

IDS=$(curl -fsL "$API_BASE/user/$username.json" | jq '.submitted[]')

function count_kids_recursive() {
  sleep 1 # avoid rate limiting
  id=$1
  data=$(curl -fsL "$API_BASE/item/$id.json")
  if [[ $(echo $data | jq ".kids") == "null" ]]; then
    echo "0"
    return
  fi

  total=0
  kids=$(echo $data | jq -r ".kids[]")
  for kid in $kids; do
    kid_total=$(count_kids_recursive $kid)
    >&2 echo "kid total $kid_total"
    total=$((total + kid_total + 1))
  done
  >&2 echo "total $total"
  echo $total
}

echo "window.data = [" > data.js
for ID in $IDS
do
  html=$(curl -fsL --cookie "$HN_COOKIE" -L "$HTML_BASE/item?id=$ID")
  score=$(echo $html | pup 'table.fatitem .score json{}' | jq -r ".[0].text" | sed 's/ points\?//')

  data=$(curl -fsL "$API_BASE/item/$ID.json")
  descendants=$(count_kids_recursive $ID)
  echo "$ID $score $descendants"
  data=$(echo "${data}" | jq ". +={\"score\": $score}")
  data=$(echo "${data}" | jq ". +={\"descendants\": $descendants}")
  echo "${data}" >> data.js
  echo "," >> data.js

  sleep 1 # avoid rate limiting
done

echo "]" >> data.js
