// Makes a request to the boilerpipe (https://boilerpipe-web.appspot.com/) API, which gives us the plain text of the article w/o any markup
//
// callback takes two parameters:
//  - success: A boolean value indicating whether the request was successful
//  - json: A json object containing the API's response
//
function findHeader(text){
    var header =  $("h1:contains('" + text  + "')");
    console.log(header);
    return header;
}
function getScore() {
    var serviceUrl = "http://ec2-54-85-171-136.compute-1.amazonaws.com/article";
    url = {'article': document.URL};
    jQuery.post(serviceUrl, url, function(res) {
        res = JSON.parse(res);
        var score = res['score'];
        console.log(score)
        var title = findHeader(res['title']);
        if (title !== null) {
            title.text(title.text() + " Score: " + score);
        } else {
            alert(" Score: " + score);
        }
    });
    
}
getScore() // Have some sort of event listener to integrate the popup
