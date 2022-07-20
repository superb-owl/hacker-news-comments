# Hacker News Comment Data

This repo contains some basic scripts for downloading and visualizing your personal
comment history on Hacker News.

## Requirements
* [jq](https://github.com/stedolan/jq) for parsing JSON
* [pup](https://github.com/ericchiang/pup) for parsing HTML
* [http-server](https://github.com/ericchiang/pup) (or any other static HTTP server) for serving the website

## Downloading Data
You'll need a cookie from Hacker News in order to scrape comment scores - these are not available
via the API as far as I can tell. To find your cookie, log into HN, and open up the developer console.
If you inspect the network request for news.ycombinator.com, you'll find your cookie. Copy that and run

```bash
HN_COOKIE="<your cookie>" ./download.sh
```

This will regenerate `data.js` with your own HN data.

## Viewing the Data
Use http-server or simply open `index.html` in your browser. You should see your data visualized.
There are a few options in `chart.js` and `table.js` that can be tweaked to change the visualization.
This is a work in progress.
