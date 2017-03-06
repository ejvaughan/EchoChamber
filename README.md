# A Chrome extension that uses ML to infer the political ideology of news articles

## Installation

1. Clone this repo
2. In Chrome, navigate to `chrome://extensions/`. Make sure the "Developer mode" checkbox is checked
3. Click "Load unpacked extension..." and navigate to the repo's frontend/ subdirectory

## Project status

The extension can currently predict if an article should be classified as "Conservative" or "Liberal", which are essentially aliases for similarity to Guardian and Breitbart articles (the two sources that the model is currently trained on).

1. Adds a button to the Chrome browser UI which, when clicked, makes a POST request to the backend for the score.
2. The Flask backend uses the newspaper module to extract the plain text of the article.
3. The backend then feeds the text through the trained model and returns the predicted label to the extension.
4. The extension displays the score in a popup.
