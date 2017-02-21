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
	request.open("GET", "http://boilerpipe-web.appspot.com/extract?output=json&url=" + document.URL, true);
	request.send(null);
}

console.log("content script document.URL = " + document.URL);
requestArticleText(function(success, json) {
	if (success) {
		console.log("Retrieved article text: " + json.content);

		// Find the h1 element that contains the article's title, and append the article's word count
		var headerElements = document.getElementsByTagName("h1");
		for (var i = 0; i < headerElements.length; ++i) {
			if (json.title.startsWith(headerElements[i].textContent)) {
				var header = headerElements[i];
				header.textContent = header.textContent + " (" + json.content.trim().split(/\s+/).length + " words)";
			}
		}
	} else {
		console.log("There was an error fetching the article text");
	}
});
