function toPercent(prop) {
    return Math.round(prop * 100, 3);
}

function checkHistory(countThreshold, propThreshold, score) {
    chrome.storage.sync.get(["scoreTuple"], function(obj){
        var percentage = ((score < 0.5) ? 1 - score : score) * 100;
        var tuple = obj["scoreTuple"];
        var box = Boundary.findBox("#ecbanner");
        // alert(tuple)
        var libProp = tuple[1] / tuple[0];
        var conProp = 1 - libProp;
        if(tuple[0] > countThreshold && libProp > propThreshold) {
             echomsg = toPercent(libProp) + "% of your news has been liberal. Consider checking out the other side!";
        } else if(tuple[0] > countThreshold && conProp > propThreshold) {
             echomsg = toPercent(conProp) + "% of your news has been conservative. Consider checking out the other side!";
        } else {
            echomsg = null;
        }
        if (echomsg) {
            box.find("#loading").remove()
            box.find("#label").text(echomsg); // color the box so it POPS
            setTimeout(function(){
                box.find("#loading").fadeOut()
            	box.find("#label").text(percentage.toFixed(0) + "% chance of being " + ((score > 5) ? "liberal" : "conservative"));
            }, 3000);
        } else {
            box.find("#loading").fadeOut()
        	box.find("#label").text(percentage.toFixed(0) + "% chance of being " + ((score > 50) ? "liberal" : "conservative"));
        }

    });
}
function updateHistory(side){
    // If new score is liberal, then increment value
    var value = (side == "Liberal" ? 1 : 0);
    chrome.storage.sync.get(["scoreTuple"], function(obj){
        // I can change this tuple to an object if that's better

        var tuple = obj['scoreTuple'] || [];
        // tuple[0] = (tuple === undefined) ? 0 : tuple[0]; // Set to 0 if no prior value
        tuple[0] = 1 || tuple[0]++
        tuple[1] = value || tuple[1] + value
        chrome.storage.sync.set({"scoreTuple": tuple});
    });
}

function fetchScore(cachedArticles) {
        var url = window.location.href;
        console.log("Getting score for url: " + url);
	$.getJSON("https://allenhao.me/article", {
		article: url
	}, function(res) {
		console.log("Got result: ");
        console.log(res);
		updateHistory(res.side);

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
    checkHistory(10, .8, score);
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
        box.find("#loading").show();
        box.find("#label").text("Calculating score...");
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
