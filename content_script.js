// Make a request to the boilerpipe web API, which can give us the plain text of the article w/o any markup
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

function commonPrefixLength(str1, str2) {
	var minLength = Math.min(str1.length, str2.length);

	for (var i = 0; i < minLength; ++i) {
		if (str1[i] != str2[i]) {
			return i;
		}
	}

	return minLength;
}

console.log("content script document.URL = " + document.URL);
requestArticleText(function(success, json) {
	if (success) {
		console.log("Retrieved article text: " + json.content);

		// Find the h1 element that contains the article's title, and append the article's word count
		var headerElements = document.getElementsByTagName("h1");
		var currentBestHeader;
		var currentBestLength = 0;
		for (var i = 0; i < headerElements.length; ++i) {
			var header = headerElements[i];
			var commonPrefixLen = commonPrefixLength(header.textContent.trim(), json.title);

			if (commonPrefixLen > currentBestLength) {
				currentBestLength = commonPrefixLen;
				currentBestHeader = header;
			}
		}

		if (currentBestLength > 0) {
			currentBestHeader.textContent = currentBestHeader.textContent + " (" + json.content.trim().split(/\s+/).length + " words)";
		}
	} else {
		console.log("There was an error fetching the article text");
	}
});
