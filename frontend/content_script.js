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

function getScore() {
        var url = window.location;
        console.log("Getting score for url: " + url);
        //var serviceUrl = "https://allenhao.me/article";
        var serviceUrl = "http://localhost:5000/article";
        var data = {"article": url};

        //jQuery.post(serviceUrl, data, function(res) {
        //    res = JSON.parse(res);
        //    var score = res.score;
        //    var side = res.side;
        //    console.log("Got score: " + score);
        //    updateHistory(side);
        //    $("#score").text(toPercent(score) + "% probability of being "  + side);
        //});
}

//checkHistory(2, .8)
console.log("Getting score...");
getScore();
