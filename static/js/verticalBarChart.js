function vertBarChart_dataPrep(_data) {
  console.log(_data);

  // //this is needed to remove html special characters that come as a result of flasks jsonify
  // var decoded = $("<div/>").html(_data).text();
  // //there is still b'{json}' left, remove that via substring
  // var decoded = decoded.substring(2, decoded.length-1);

  // var dataObj = JSON.parse(decoded);
  
  return _data;
}


function VerticalBarChart(data, svgDivId, {
  x = (d, i) => d, // given d in data, returns the (quantitative) x-value
  y = d => d, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 60, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = parseInt(d3.select(svgDivId).style('width'), 10), // the outer width of the chart, in pixels
  height, // outer height, in pixels
  yType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yFormat = "s",
  xLabel, // a label for the x-axis
  yLabel,
  xPadding = 0.1, // amount of y-range to reserve to separate bars
  yDomain, // an array of (ordinal) y-values
  yRange = [height - marginBottom, marginTop], // [top, bottom]
  color = "currentColor", // bar fill color
  mouseoverColor = '#F44336',
  titleColor = "white", // title fill color when atop bar
  titleAltColor = "currentColor", // title fill color when atop background
} = {}) {
  var X = [], Y = [];

  X = d3.map(data, x);
  Y = d3.map(data, y);

  // Compute default domains, and unique the x-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);

  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  const svg = d3.select(svgDivId).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  // Construct scales, axes, and formats.
  const yScale = yType(yDomain, yRange);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  const formatValue = yScale.tickFormat(100, yFormat);
  title = i => `${X[i]}\n${formatValue(Y[i])}`;

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("id", "yAxis")
      .call(yAxis)
      .call(g => g.select(".domain").remove())  // removes the axis bar on left side
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const bar = svg.append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
      .attr("y", i => yScale(Y[i]))
      .attr("height", i => yScale(0) - yScale(Y[i]))
      .on('mouseover', function(d) {
              d3.select(this).attr("fill", mouseoverColor)
          })
      .on('mouseout', function(d) {
                d3.select(this).attr("fill", color)
            })

  if (title) bar.append("title")
      .text(title);

  svg.append("g")
    .attr("class", "barText")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //.call(xAxis);
    .call(g => g.append("text")
          .attr("id", "xAxisText")
          .attr("x", width - marginRight)
          .attr("y", 35)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  return {
    marginLeft,
    marginRight,
    height,
    xDomain,
    xPadding,
    X
  }
}

function vertBarChart_Resize(svgDivId, {
  marginLeft,
  marginRight,
  height,
  xDomain,
  xPadding,
  X
} = {}) {
  let svg = d3.select(svgDivId).select('svg');

  currentWidth = parseInt(d3.select('#div_basicResize').style('width'), 10);
  xRangeCur = [marginLeft, currentWidth - marginRight];

  svg.attr("width", currentWidth)
        .attr("viewBox","0 0 " + currentWidth + " " + height);

  d3.select(svgDivId).select("#yAxis").selectAll(".tick line")
          .attr("x2", currentWidth - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1);

  svg.select("#xAxisText")
          .attr("x", currentWidth - marginRight)
          .attr("y", 35)

  var xScale = d3.scaleBand(xDomain, xRangeCur).padding(xPadding);
  var xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
    //show every third lable if bar width on smaller screens
    .tickFormat((interval,i) => {
      if (xScale.bandwidth() < 35) {
        return i%3 !== 0 ? " ": interval;
      }else {
        return interval;
      }

    });

  // update the bar size
  d3.select(svgDivId).selectAll("rect")
    .attr("x", i => xScale(X[i]))
    .attr("width", xScale.bandwidth());

  d3.select(svgDivId).selectAll(".barText").call(xAxis);
}