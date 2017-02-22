# A Chrome extension that uses ML to infer the political ideology of news articles

## Installation

1. Clone this repo
2. In Chrome, navigate to `chrome://extensions/`. Make sure the "Developer mode" checkbox is checked
3. Click "Load unpacked extension..." and navigate to the directory containing the repo's files

## Project status

Right now, this extension is pretty useless, as the backend that runs the ML algorithm is not yet implemented. It currently has the following functionality

1. Adds a button to the Chrome browser UI which, when clicked, injects a script (`content_script.js`) into the webpage
2. The script makes an AJAX request to the [boilerpipe](https://boilerpipe-web.appspot.com/) web API to get the raw text of the article. boilerpipe's algorithms can determine what part of the HTML document contains the actual article text, which is all that we care about.
3. Once the article text has been retrieved, the script modifies the DOM to append the word count to the article's title