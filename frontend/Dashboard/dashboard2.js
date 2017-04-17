var cachedArticles = [	
	{
		"score":0.69,
		"date":"2017/01/03",
		"url":"cnn.com/article1"
	},
	{
		"score":0.2,
		"date":"2017/01/07",
		"url":"foxnews.com/article1"
	},
	{
		"score":0.4,
		"date":"2017/01/16",
		"url":"newyorkpost.com/article1"
	},
	{
		"score":0.1,
		"date":"2017/01/27",
		"url":"breitbart.com/article1"
	},
	{
		"score":0.62,
		"date":"2017/02/12",
		"url":"newyorktimes.com/article1"
	},
	{
		"score":0.86,
		"date":"2017/02/20",
		"url":"salon.com/article1"
	},
	{
		"score":0.56,
		"date":"2017/03/21",
		"url":"moderateLeft.com/article1"
	},
	{
		"score":0.45,
		"date":"2017/03/23",
		"url":"moderateRight.com/article1"
	},
	{
		"score":0.05,
		"date":"2017/04/09",
		"url":"farRight.com/article1"
	},
	{
		"score":0.95,
		"date":"2017/04/10",
		"url":"farLeft.com/article1"
	}	];
var slider_value = 0;

var options = ["Past Week", "Past Month", "Past 3 Months", "Past 6 Months", "Past Year"];

var svg = d3.select("svg");
var margin = {left: 370, right: 250};
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
	margin = {top: 100, right: 0, bottom: 60, left: 120},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("id", "chart");

	console.log(data);

	values = [];

	// loop through data, get all values within specified date range 
	data.forEach(function(d) {
	    d.date = new Date(d.date);
	    // console.log(d.date);
	    days = num_days_from_today(d.date);
	    // console.log(days);
	    if (days <= cutoff) {
			values.push(d.score);
	    }
	});

	console.log(values);

	var x = d3.scaleLinear()
	    .rangeRound([0, width]);

	var histogram = d3.histogram()
	    .domain(x.domain())
	    .thresholds(x.ticks(10));

	var bins = histogram(values);

	var y = d3.scaleLinear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([height, 0]);

	var bar = g.selectAll(".bar")
		.data(bins)
		.enter().append("g")
			.attr("class", "bar")
	    	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

	bar.append("rect")
	    .attr("x", 1.5)
	    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1.5)
	    .attr("height", function(d) { return height - y(d.length); })
		.attr("fill", function(d) {
			if (d.x0 > 0.6) {   return "blue";   }
			else if (d.x0 < 0.4) {   return "red"   }
			else {  return "purple";  }
	    })
	    .on("mouseover", function(d, i){
			d3.select(this).style("fill", "black");
	    })
	    .on("mouseout", function(){
			d3.select(this).style("fill", function(d) {
			    if (d.x0 > 0.6) {   return "blue";   }
			    else if (d.x0 < 0.4) {   return "red"   }
			    else {  return "purple";  }
			});
	    });

	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.length); });

	g.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x))
	    .append("text")
			.attr("transform", "translate(" + width/2 + "," + (27/32*margin.bottom) + ")")
			.attr("text-anchor", "middle")
			.style("fill", "black")
			.style("font-weight", "bold")
			.text("Percent Likelihood of Being Liberal")
			.style("font-size","26");

	g.append("g")
	    .attr("class", "axis axis--y")
	    .append("text")
			.attr("y", -30)
			.attr("x", -1*height/2)
			.attr("transform", "rotate(-90)")
			.attr("text-anchor", "middle")
			.style("fill", "black")
			.style("font-weight", "bold")
			.text("Article Count")
			.style("font-size","26");

	console.log("YO")!

	g.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisTop(x))
	    .append("text")
			.attr("transform", "translate(" + width/2 + "," + (27/32*margin.bottom) + ")")
			.attr("text-anchor", "middle")
			.style("fill", "black")
			.style("font-weight", "bold")
			.text("Percent Likelihood of Being Liberal")
			.style("font-size","26");
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

create_chart(cachedArticles, 7);

// // Fetch the articles from the locale cache
// chrome.storage.sync.get("history", function(storage) {
// 	cachedArticles = storage["history"];
// 	if (cachedArticles === undefined) {
// 		cachedArticles = [];
// 	}

// 	create_chart(cachedArticles, 7);
// });