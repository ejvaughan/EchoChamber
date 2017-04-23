// var cachedArticles = [	
// 	{
// 		"score":0.69,
// 		"date":"2017/01/03",
// 		"url":"cnn.com/article1"
// 	},
// 	{
// 		"score":0.2,
// 		"date":"2017/01/07",
// 		"url":"foxnews.com/article1"
// 	},
// 	{
// 		"score":0.4,
// 		"date":"2017/01/16",
// 		"url":"newyorkpost.com/article1"
// 	},
// 	{
// 		"score":0.1,
// 		"date":"2017/01/27",
// 		"url":"breitbart.com/article1"
// 	},
// 	{
// 		"score":0.62,
// 		"date":"2017/02/12",
// 		"url":"newyorktimes.com/article1"
// 	},
// 	{
// 		"score":0.86,
// 		"date":"2017/02/20",
// 		"url":"salon.com/article1"
// 	},
// 	{
// 		"score":0.56,
// 		"date":"2017/03/21",
// 		"url":"moderateLeft.com/article1"
// 	},
// 	{
// 		"score":0.45,
// 		"date":"2017/03/23",
// 		"url":"moderateRight.com/article1"
// 	},
// 	{
// 		"score":0.05,
// 		"date":"2017/04/09",
// 		"url":"farRight.com/article1"
// 	},
// 	{
// 		"score":0.95,
// 		"date":"2017/04/10",
// 		"url":"farLeft.com/article1"
// 	}	];

var cachedArticles = []
var slider_value = 0;

var options = ["Past Week", "Past Month", "Past 3 Months", "Past 6 Months", "Past Year"];
var colors = ["#063E78", "#08519C", "#3182BD", "#6BAED6", "#9ECAE1", "#FC9272", "#FB6A4A", "#DE2D26", "#A50F15", "#860308"]
var color = d3.scaleLinear()
    .domain([0, .1, .2, .3, .4, .5, .6, .7, .8, .9])
    .range(["#063E78", "#08519C", "#3182BD", "#6BAED6", "#9ECAE1", "#FC9272", "#FB6A4A", "#DE2D26", "#A50F15", "#860308"]);

var svg = d3.select("svg");
var margin = {left: 387, right: 233};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, 4])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 20 + ")");

slider.append("line")
    	.attr("class", "track")
    	.attr("x1", x.range()[0])
    	.attr("x2", x.range()[1])
	.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    	.attr("class", "track-inset")
	 .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr("class", "track-overlay")
	    .call(d3.drag()
		.on("start.interrupt", function() { slider.interrupt(); })
		.on("start drag", function() {
		    var xVal = x.invert(d3.event.x);
		    handle.attr("cx", x(xVal));
		})
		.on("start end", function() {
		    var xVal = Math.round(x.invert(d3.event.x));
		    handle.attr("cx", x(xVal));
		    change_chart(xVal);
		}));

slider.insert("g", ".track-overlay")
		.attr("class", "ticks")
		.attr("transform", "translate(0," + 18 + ")")
	.selectAll("text")
	.data(x.ticks(5))
	.enter().append("text")
		.attr("x", x)
    	.attr("text-anchor", "middle")
    	.attr("transform", "translate(0," + 5 + ")")
    	.style("fill", "white")
    	.text(function(d) { return options[d]; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);
    // .attr("height", 18)
    // .attr("width", 5);

function num_days_from_today(d) {
    var today = new Date();
    var diff = Math.abs(today.getTime() - d.getTime());
    return diff / (1000 * 60 * 60 * 24);
};

function create_chart(data, cutoff) {
    var formatCount = d3.format(",.0f");

    var svg = d3.select("svg"),
	margin = {top: 100, right: 0, bottom: 60, left: 160},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("id", "chart");

	console.log(data);

	var values = [];
	var sumValues = 0;

	// loop through data, get all values within specified date range 
	data.forEach(function(d) {
	    d.date = new Date(d.date);
	    days = num_days_from_today(d.date);
	    if (days <= cutoff) {
			values.push(d.score);
			sumValues += d.score;
	    }
	});

	var averageScore = (sumValues / values.length).toFixed(2);
	console.log("Average Score: " + averageScore);

	console.log(values);

	var x = d3.scaleLinear()
	    .rangeRound([0, .99*width]);

	var histogram = d3.histogram()
	    .domain(x.domain())
	    .thresholds(x.ticks(10));

	var bins = histogram(values);

	var y = d3.scaleLinear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([height, .02*height]);

	var bar = g.selectAll(".bar")
		.data(bins)
		.enter().append("g")
			.attr("class", "bar")
	    	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

	var bin = 0;

	bar.append("rect")
	    .attr("x", 1.5)
	    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 2)
	    .attr("height", function(d) { return height - y(d.length); })
		.attr("fill", function(d, i) {	return colors[i];	})
	    .on("mouseover", function(d, i){
	    	bin = i;
			d3.select(this).style("fill", "black");
			// var minI = i/10;
			// var maxI = (i+1)/10;
			// console.log("Range: " + minI + " to " + maxI);
			// var dataInRange = [];
			// data.forEach(function(d) {
			//     score = d.score;
			// 	if (d.score >= minI && d.score < maxI) {
			// 		// console.log(d);
			// 		dataInRange.push(d);
			// 	}
			// });
			// console.log(dataInRange);
			// d3.select(this).append("text")
			// 	.style("fill", "white")
			// 	.text("TROLLLLTROLLLLTROLLLLTROLLLLTROLLLLTROLLLLTROLLLL");
	    })
	    .on("mouseout", function(){	
	    	d3.select(this).style("fill", function(d, i) {	return colors[bin];	});
	    });

	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.length); });

	g.selectAll(".legend_rect")
          .data(color.domain())
        .enter().append("rect")
          .attr("class", "legend_rect")
          .attr("x", function(d, i) { return (.99*width/10)*(i); })
          .attr("y", 1.05*height)
          .attr("width", 100)
          .attr("height", 10)
          .style("fill", function(d, i) { return color(d); });

	g.append("g")
		.attr("class", "xAxis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x))
	    .append("text")
			.attr("transform", "translate(" + .99*width/2 + "," + (31/32*margin.bottom) + ")")
			.attr("text-anchor", "middle")
			.style("fill", "white")
			.style("font-weight", "bold")
			.text("Article Score")
			.style("font-size","26");

	g.append("g").append("text")
		.attr("y", -30)
		.attr("x", -1*height/2)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.style("fill", "white")
		.style("font-weight", "bold")
		.text("Article Count")
		.style("font-size","26");

	g.append("g").append("text")
		.attr("transform", "translate(" + .99*width/2 + "," + -1*(3/16*margin.bottom) + ")")
		.attr("text-anchor", "middle")
		.style("fill", "white")
		.style("font-weight", "bold")
		.text("What Am I Reading?")
		.style("font-size","26");

	g.append("g")
		.attr("class", "xAxis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x))
	    .append("text")
			.attr("transform", "translate(" + width/20 + "," + (29/32*margin.bottom) + ")")
			.attr("text-anchor", "middle")
			.style("fill", "white")
			.style("font-weight", "bold")
			.text("Liberal")
			.style("font-size","20");

	g.append("g")
		.attr("class", "xAxis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x))
	    .append("text")
			.attr("transform", "translate(" + .99*19*width/20 + "," + (29/32*margin.bottom) + ")")
			.attr("text-anchor", "middle")
			.style("fill", "white")
			.style("font-weight", "bold")
			.style("font-size","18")
			.text("Conservative");

	g.append("g").append("text")
		.attr("transform", "translate(" + -width/20 + "," + -10/16*margin.top + ")")
		.attr("text-anchor", "middle")
		.style("fill", "white")
		.style("font-weight", "bold")
		.style("font-size","18")
		.text("Average Score: \n " + averageScore);

	g.append("g").append("text")
		.attr("transform", "translate(" + -width/20 + "," + -7/16*margin.top + ")")
		.attr("text-anchor", "middle")
		.style("fill", "white")
		.style("font-weight", "bold")
		.style("font-size","18")
		.text(function(i,d) {
			if(averageScore < .35) { return "Liberal" }
			else if(averageScore < .5) { return "Moderately Liberal" }
			else if(averageScore < .65) { return "Moderately Conservative" }
			else { return "Conservative" }
		});
};

function change_chart(slider_value) {
    $("#chart").remove();
    switch(slider_value) {
	case 0:
	    create_chart(cachedArticles, 7);
	    break;
	case 1:
	    create_chart(cachedArticles, 30);
	    break;
	case 2:
	    create_chart(cachedArticles, 90);
	    break;
	case 3:
	    create_chart(cachedArticles, 180);
	    break;
	default:
	    create_chart(cachedArticles, 365);
    }
};

// create_chart(cachedArticles, 7);

// Fetch the articles from the locale cache
chrome.storage.sync.get("articles", function(storage) {
	cachedArticles = storage["articles"];
	if (cachedArticles === undefined) {
		cachedArticles = [];
	}
	create_chart(cachedArticles, 7);
});