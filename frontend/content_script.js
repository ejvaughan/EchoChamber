function toPercent(prop) {
    return Math.round(prop * 100, 3);
}

function checkHistory(countThreshold, propThreshold) {
    console.log("here")
    chrome.storage.sync.get(["scoreTuple"], function(obj){
        var tuple = obj["scoreTuple"];
        var libProp = tuple[1] / tuple[0];
        var conProp = 1 - libProp;
        console.log(tuple[0])
        console.log(tuple[0] > countThreshold)
        console.log(libProp)
        console.log(libProp > propThreshold)
        if(tuple[0] > countThreshold && libProp > propThreshold) {
            //$("#reminder").text(toPercent(libProp) + "% of your news has been liberal. Consider checking out the other side!");
        } else if(tuple[0] > countThreshold && conProp > propThreshold) {
            //$("#reminder").text(toPercent(conProp) + "% of your news has been conservative. Consider checking out the other side!");
        }
    });
}
function updateHistory(side){
    // If new score is liberal, then increment value
    var value = side;
    chrome.storage.sync.get(["scoreTuple"], function(obj){
        // I can change this tuple to an object if that's better
        var tuple = obj['scoreTuple']
        console.log(tuple)
        tuple[0] = (tuple[0] === undefined) ? 0 : tuple[0]; // Set to 0 if no prior value
        tuple[1] = (tuple[1] === undefined) ? 0 : tuple[1];
        var articleCount = tuple[0] +1;
        var liberalCount = tuple[1] + value;
        console.log(articleCount)
        var newTuple = [articleCount, liberalCount];
        chrome.storage.sync.set({"scoreTuple": newTuple});
    });
}

function fetchScore(cachedArticles) {
        var url = window.location.href;

        console.log("Getting score for url: " + url);

	$.getJSON("https://allenhao.me/article", {
		article: url
	}, function(res) {
		console.log("Got result: " + res);

		//updateHistory(side);
		
		// Scores are stored in the cache as probability of being liberal
		var score = (res.side === "Conservative") ? 1 - res.score : res.score;

		// Store in the locale cache
		chrome.storage.sync.set({
			"history": cachedArticles.concat({
				url: url,
				score: score,
				date: Date.now()
			})
		}, function() {
			console.log("Stored score in local cache");
		});

		displayScore(score);
	});
}

function displayScore(score) {
	var percentage = ((score < 0.5) ? 1 - score : score) * 100;

	var box = Boundary.findBox("#ecbanner");
	box.find("#loading").fadeOut()
	box.find("#label").text(percentage.toFixed(0) + "% chance of being " + ((score > 0.5) ? "liberal" : "conservative"));
}

function displayBanner() {
	var box = Boundary.findBox("#ecbanner");
	if (box.length == 0) {
		var closeImageURL = chrome.runtime.getURL("close.svg");
		var loadingImageURL = chrome.runtime.getURL("loading.svg");

		box = Boundary.createBox("ecbanner");
		var frame = $("#ecbanner").css("display", "none");

		box.html("<img id='loading' src='" + loadingImageURL + "'>" +
			"<span id='label'></span>" + 
			"<div id='rightContainer'><a id='dashboard'>Open dashboard...</a>" + 
			"<img id='close' src='" + closeImageURL + "'></div>");

		Boundary.loadBoxCSS("#ecbanner", chrome.runtime.getURL("banner_elements.css"));

		box.find("#loading").hide();

		// Set up event listeners
		box.find("#close").click(function() {
			frame.fadeOut();
		});

		box.find("#dashboard").click(function() {
			chrome.runtime.sendMessage({ command: "openDashboard" });
		});
	}

	$("#ecbanner").fadeIn();
	
	// Check if we have a score for this article in the local cache
	chrome.storage.sync.get("history", function(storage) {
		console.log("Got storage: " + storage);
		var cachedArticles = storage["history"];
		if (cachedArticles === undefined) {
			cachedArticles = [];
		}

		var matchingArticles = cachedArticles.filter(function(article) {
			return article.url === window.location.href;
		});

		if (matchingArticles.length === 1) {
			console.log("Got result in cache");
			displayScore(matchingArticles[0].score);
		} else {
			box.find("#loading").show();
			box.find("#label").text("Calculating score...");

			fetchScore(cachedArticles);
		}
	});
}

displayBanner();

