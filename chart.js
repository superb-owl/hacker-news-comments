const X_FIELD="timeParsed"
const Y_FIELD="score"

const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;

data = data.filter(d => d.score !== null);
data = data.sort((d1, d2) => {
  return d1.time - d2.time;
});

var totalScore = 0;
data.forEach(d => {
  d.timeParsed = new Date(d.time * 1000);
  d.numKids = (d.kids || []).length;
  totalScore += (d.score - 1);
  d.totalScore = totalScore;
  d.numWithSameScore = data.filter(d2 => d2.score === d.score).length;
})


const startTime = d3.min(data, d => d.time);
const endTime = d3.max(data, d => d.time);

const weekBuckets = [];
let curTime = startTime;
while (curTime < endTime) {
  weekBuckets.push({
    start: curTime,
    end: curTime + SECONDS_IN_WEEK,
  });
  curTime += SECONDS_IN_WEEK;
}

weekBuckets.forEach(bucket => {
  bucket.data = data.filter(d => {
    return d.time >= bucket.start && d.time < bucket.end;
  });
  bucket.numPosts = bucket.data.length;

  bucket.score = bucket.data.reduce((acc, cur) => {
    return acc + cur.score;
  }, 0.0);
  bucket.totalScore = d3.max(bucket.data, d => d.totalScore);
  bucket.avgScore = bucket.score / bucket.numPosts;
  bucket.medianScore = bucket.data.map(d => d.score).sort((d1, d2) => {
    return d1 - d2
  })[Math.floor(bucket.data.length / 2)];
  console.log('median', bucket.medianScore);
  console.log('avg', bucket.avgScore);

  bucket.kids = bucket.data.reduce((acc, cur) => {
    return acc + cur.numKids;
  }, 0.0);
  bucket.avgKids = bucket.kids / bucket.numPosts;
  bucket.medianKids = bucket.data.map(d => d.numKids).sort((d1, d2) => {
    return d1 - d2
  })[Math.floor(bucket.data.length / 2)]
});

console.log('weeks', weekBuckets);

var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

if (X_FIELD === "timeParsed") {
  x = d3.scaleTime().range([0, width]);
}

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Scale the range of the data in the domains
x.domain([d3.min(data, d => d[X_FIELD]), d3.max(data, d => d[X_FIELD] )]);
y.domain([d3.min(data, d => d[Y_FIELD]), d3.max(data, d => d[Y_FIELD] )]);

// append the rectangles for the bar chart
svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[X_FIELD]); })
    .attr("width", 2)
    .attr("y", function(d) { return y(d[Y_FIELD]); })
    .attr("height", function(d) { return height - y(d[Y_FIELD]); });

// add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
    .call(d3.axisLeft(y));

