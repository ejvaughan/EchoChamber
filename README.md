# A Chrome extension that uses ML to infer the political ideology of news articles

## Installation

1. Clone this repo
2. In Chrome, navigate to `chrome://extensions/`. Make sure the "Developer mode" checkbox is checked
3. Click "Load unpacked extension..." and navigate to the repo's frontend/ subdirectory

## Project status

The extension can currently predict if an article should be classified as "Conservative" or "Liberal", which are essentially aliases for classification for similarity to Guardian or Breitbart articles. The extension then inserts this into the headline.
1. Adds a button to the Chrome browser UI which, when clicked, injects a script (`content_script.js`) into the webpage
2. The script makes an POST request to a local Flask server, sending the URL.
3. The Flask server uses the newspaper module to parse the text of the header and to get the text.
4. The server then feeds the text through the trained model and returns the predicted label for the text as well as the header text.
5. The extension then uses JQuery to find the headline and inserts the score into the DOM. If the headline cannot be found, it will send an alert to show the score.
