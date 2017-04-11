chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("Button clicked");

	chrome.tabs.executeScript(null, { file: "jquery.js" });
	chrome.tabs.insertCSS(null, { file: "content_script.css" });
	chrome.tabs.executeScript(null, { file: "content_script.js" });
});
