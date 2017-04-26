function toPercent(prop) {
    return Math.round(prop * 100, 3);
}
function displayScore(score, side) {
    console.log(side)
	var box = Boundary.findBox("#ecbanner");
	var percentage = toPercent(score)
	box.find("#loading").fadeOut();
    box.find("#label").text(percentage.toFixed(0) + "% chance of being " + side);

}


function checkEcho(countThreshold, propThreshold, score, side) {
    chrome.storage.sync.get(["props"], function(storage){
        var box = Boundary.findBox("#ecbanner");
        var props = storage.props;
        if (props == undefined) { //Catch both undefined and nulls
        	props = { 
        		"totalCount" : 1,
        		"libCount" : side == 'liberal' ? 1 : 0
        	}
        } else {
        	props.totalCount++;
        	props.libCount += side == 'liberal' ? 1 : 0;
        }
        var libProp = props.libCount / props.totalCount;
        var qualifiedCount = props.totalCount > countThreshold; // We only want to check periodically
        if(qualifiedCount && libProp > propThreshold) {
            echomsg = toPercent(libProp) + "% of your last " + countThreshold + " news articles have been liberal. Consider checking out the other side!";
        } else if(qualifiedCount  && 1 - libProp > propThreshold) {
            echomsg = toPercent(1 - libProp) + "% of your last " + countThreshold + " news articles has been conservative. Consider checking out the other side!";
        } else {
            echomsg = null;
        }
        if (echomsg === null) { // Don't show the score
        	displayScore(score, side);
        } else {
            box.find("#loading").remove();
            box.find("#label").text(echomsg); 
            // TODO color the box so it POPS 
            setTimeout(function() {
                displayScore(score, side) // Have to do it with anonymous function to pass score args
            }, 5000);
            props = null; // unset props so we can keep track of next period
        }
        chrome.storage.sync.set({ // Update props
			"props": props
		});

    });
}

function fetchScore() {
        var url = window.location.href;
        console.log("Getting score for url: " + url);
	$.getJSON("https://allenhao.me/article", {
		article: url
	}, function(res) {
		console.log("Got result: ");
        console.log(res);
        var countThreshold = 5; // Number of articles before checking for echo chamber
		var propThreshold = 0.7;
        checkEcho(countThreshold, propThreshold, res.score, res.side);
        chrome.storage.sync.get(["articles"], function(storage) {
            articles = storage.articles;
            console.log(res.side);
            if (res.side == 'liberal') { // Transform score for easier reading in viz
                res.score = 1 - res.score;
            }
            var article = {
                    'score' : res.score, // Store score as percentage of being conservative
                    'date' : Date.now()
            }
            if (articles === undefined) {
                articles = [article]; // Make new array with single element for now
            } else {
                console.log(articles);
                articles.push(article);
            }
            chrome.storage.sync.set({'articles' : articles});    
        })
        
	});
}

function displayBanner() {
	var box = Boundary.findBox("#ecbanner");
	if (box.length === 0) {
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

	box.find("#loading").show();
    box.find("#label").text("Calculating score...");
    fetchScore();
}

displayBanner();
// chrome.storage.sync.clear();
