// Makes a request to the boilerpipe (https://boilerpipe-web.appspot.com/) API, which gives us the plain text of the article w/o any markup
//
// callback takes two parameters:
//  - success: A boolean value indicating whether the request was successful
//  - json: A json object containing the API's response
//
function findHeader(text){
  var header =  $("h1:contains('" + text  + "')");
  console.log(header);
  return header 
}
var serviceUrl = "http://localhost:5000/article";
url = {'article': document.URL};
jQuery.post(serviceUrl, url, function(res) {
	res = JSON.parse(res);
  var score = res['score'];
	console.log(score)
	console.log(res['title'])
  var title = findHeader(res['title'])
  console.log(title)
  if (title !== null) {
		title.text(title.text() + " Score: " + score);
  } else {
    alert(" Score: " + score)
	}
});
