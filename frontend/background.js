chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("Button clicked");

	chrome.tabs.insertCSS(null, { file: "boundary/boundary.css" });
	chrome.tabs.executeScript(null, { file: "boundary/jquery.js" });
	chrome.tabs.executeScript(null, { file: "boundary/boundary.js" });

	chrome.tabs.insertCSS(null, { file: "banner.css" });
	chrome.tabs.executeScript(null, { file: "content_script.js" });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "openDashboard")
	chrome.tabs.create({ url: "Dashboard/dashboard.html" });
      sendResponse({success: true});
  });
