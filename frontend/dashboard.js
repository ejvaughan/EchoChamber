function visualize(history)
{
}

chrome.storage.sync.get("history", function(storage) {
	console.log("Retrieved history");

	visualize(storage["history"]);
});
