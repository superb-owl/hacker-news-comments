#! /bin/bash
set -eo pipefail

API_BASE="https://hacker-news.firebaseio.com/v0"
HTML_BASE="https://news.ycombinator.com"

curl -s "$API_BASE/user/superb-owl.json" | jq '.submitted[]' > ids.txt

IDS=$(cat ids.txt)

echo "window.data = [" > data.js
for ID in $IDS
do
  echo $ID
  html=$(curl -fsL --cookie "$HN_COOKIE" -L "$HTML_BASE/item?id=$ID")
  score=$(echo $html | pup 'table.fatitem .score json{}' | jq -r ".[0].text" | sed 's/ points\?//')
  echo $score

  data=$(curl -fsL "$API_BASE/item/$ID.json")
  data=$(echo "${data}" | jq ". +={\"score\": $score}")
  echo "${data}" >> data.js
  echo "," >> data.js
  #text=$(echo $data | jq -r .text | sed "s/&#x27;/'/g" | sed "s/<p>/\n\n/g" | sed "s/&gt;/>/g" | sed "s/&lt;/</g")
  #kids=$(echo $data | jq '.kids | length')
  sleep 1
done

echo "]" >> data.js
