chrome.browserAction.onClicked.addListener(function() {
	console.log("Button clicked");

	// Open the dashboard UI
	chrome.tabs.create({ url: "dashboard.html" }, function(tab) {
		console.log("Dashboard opened");
	});
});
