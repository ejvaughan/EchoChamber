// Makes a request to the boilerpipe (https://boilerpipe-web.appspot.com/) API, which gives us the plain text of the article w/o any markup
//
// callback takes two parameters:
//  - success: A boolean value indicating whether the request was successful
//  - json: A json object containing the API's response
//
function requestArticleText(callback) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var json = JSON.parse(request.responseText);
				callback(true, json.response);
			} else {
				callback(false);
			}
		}
	};
	request.open("GET", "https://boilerpipe-web.appspot.com/extract?output=json&url=" + document.URL, true);
	request.send(null);
}

// Returns the h1 element with the longest common prefix to text
function headerElementMatching(text) {

	function commonPrefixLength(str1, str2) {
		var minLength = Math.min(str1.length, str2.length);

		for (var i = 0; i < minLength; ++i) {
			if (str1[i] != str2[i]) {
				return i;
			}
		}

		return minLength;
	}

	var headerElements = document.getElementsByTagName("h1");
	var currentBestHeader = null;
	var currentBestLength = 0;
	for (var i = 0; i < headerElements.length; ++i) {
		var header = headerElements[i];
		var commonPrefixLen = commonPrefixLength(header.textContent.trim(), text);

		if (commonPrefixLen > currentBestLength) {
			currentBestLength = commonPrefixLen;
			currentBestHeader = header;
		}
	}

	return currentBestHeader;
}


console.log("content script document.URL = " + document.URL);

requestArticleText(function(success, json) {
	if (success) {
		console.log("Retrieved article text: " + json.content);

		var header = headerElementMatching(json.title);
		if (header) {
			header.textContent = header.textContent + " (" + json.content.trim().split(/\s+/).length + " words)";
		}
	} else {
		console.log("There was an error fetching the article text");
	}
});
