function vbc2_dataPrep(_data) {
  console.log(_data);

  // //this is needed to remove html special characters that come as a result of flasks jsonify
  // var decoded = $("<div/>").html(_data).text();
  // //there is still b'{json}' left, remove that via substring
  // var decoded = decoded.substring(2, decoded.length-1);

  // var dataObj = JSON.parse(decoded);
  
  return _data;
}

function vbc2_chartProc(_data, _svgDivId, {
  x = (d, i) => d, // given d in data, returns the (quantitative) x-value
  y = d => d, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 60, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = parseInt(d3.select(_svgDivId).style('width'), 10), // the outer width of the chart, in pixels
  height, // outer height, in pixels
  yType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yFormat = "d",
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
  // console.log(width);
  let vbc2_animate = true;
  //prep svg
  if(d3.select(_svgDivId).select("svg").empty()){
    vbc2_animate = false;
    var vbc2_initParams = vbc2_init(_svgDivId, _data, width, height, marginLeft, marginRight, marginBottom, yLabel, xLabel, x, color);
  }

  //set data
  var vbc2_resizeParams = vbc2_changeData(_data, _svgDivId, x, y, yType, yRange, height,
    yFormat, 
    marginLeft,
    marginRight,
    yLabel,
    color,
    mouseoverColor,
    vbc2_initParams,
    xPadding,
    width,
    vbc2_animate);   

  vbc2_resize(vbc2_resizeParams);
}

function vbc2_init(_svgDivId, _data, _width, _height, marginLeft, marginRight, marginBottom, _yLabel, xLabel, _x, color){
  var X = [];
  X = d3.map(_data, _x);
  xDomain = X;
  xDomain = new d3.InternSet(xDomain);
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  svg = d3.select(_svgDivId).append("svg")
  .attr("width", _width)
  .attr("height", _height)
  .attr("viewBox", [0, 0, _width, _height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("id", "yAxis")
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(_yLabel));

  const bar = svg.append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
      // .attr("x", xScale(0))

  svg.append("g")
      .attr("id", "xAxis")
      .attr("transform", `translate(0,${_height - marginBottom})`)
      .call(g => g.append("text")
            .attr("id", "xAxisText")
            .attr("x", _width - marginRight)
            .attr("y", 35)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
  //create initial barText
  //without there are issues because of first animation, even when "turned off"
  svg.append("g")
    .attr("id", "barText")
    .attr("fill", "white")
    .attr("text-anchor", "start")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
      .selectAll("text")
      .data(I)
      .join("text")
        .attr("class", "foo")

  return {
    X,
    xDomain,
    I
  };
}

function vbc2_changeData(_data, _svgDivId, _x, _y, _yType, _yRange,
    _height,
    _yFormat,
    marginLeft,
    marginRight,
    _yLabel,
    _color,
    _mouseoverColor,
    {
      X,
      xDomain,
      I
    } = {},
    xPadding,
    width,
    vbc2_animate)
{


  if (X === undefined) X = d3.map(_data, _x);
  if (xDomain === undefined) xDomain = X;
  xDomain = new d3.InternSet(xDomain);
  if (I === undefined) I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  var Y = [];
  Y = d3.map(_data, _y);
  yDomain = [0, d3.max(Y)];

  // Construct scales, axes, and formats.
  const yScale = _yType(yDomain, _yRange);
  const yAxis = d3.axisLeft(yScale).ticks(_height / 40, _yFormat);

  function formatValue(number){
    return (number < 1000) ? d3.format("d")(number) : d3.format(".2s")(number) 
  }

  title = i => `${formatValue(Y[i])}`;

  d3.select(_svgDivId).select("#yAxis")
    .transition().duration(vbc2_animate ? 1000 : 0)
          .call(yAxis)
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line")
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))

  const bar = d3.select(_svgDivId).selectAll("rect")

  bar
    .on('mouseover', function(d) {
            d3.select(this).attr("fill", _mouseoverColor)
        })
    .on('mouseout', function(d) {
              d3.select(this).attr("fill", _color)
          })

  bar
    // .data(I)
    .join("rect")
    .transition()
    .duration(vbc2_animate ? 1000 : 0)
      .attr("y", i => yScale(Y[i]))
      .attr("height", i => yScale(0) - yScale(Y[i]))

  //set barText values
  d3.select(_svgDivId).select("#barText")
          .selectAll("text")
          .data(I)
          .join("text")
          .transition()
          .duration(vbc2_animate ? 1000 : 0)
            .attr("y", i => yScale(Y[i]))
            .attr("dy", "1.0em")
            // .attr("dx", "0.35em") //use this to position on x axis
            .text(title)
              .call(text => text.filter(i => yScale(0) - yScale(Y[i]) < 0.1) // short bars
                .attr("fill", "black")
                .attr("visibility", "hidden"));
          //     .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 25) // short bars
          //         .attr("dx", +4)
          //         .attr("fill", titleAltColor)
          //         .attr("text-anchor", "start"))
          //     .call(text => text.filter(i => xScale(X[i]) - xScale(0) >= 25) // long bars
          //         .attr("dx", -4)
          //         .attr("fill", titleColor)
          //         .attr("text-anchor", "end"));

    

  let resizeEventParams = {
    _svgDivId, 
    marginLeft, 
    marginRight, 
    _height,
    bar,
    X,
    xDomain,
    xPadding
  }

  window.addEventListener('resize', () => {vbc2_resize(resizeEventParams);} );

  return resizeEventParams
}

function vbc2_resize({
  _svgDivId, 
  marginLeft, 
  marginRight, 
  _height,
  bar,
  X,
  xDomain,
  xPadding
} = {}) {

  let svg = d3.select(_svgDivId).select('svg');

  currentWidth = parseInt(d3.select('#div_basicResize').style('width'), 10);
  // console.log(currentWidth);
  xRangeCur = [marginLeft, currentWidth - marginRight];

  svg.attr("width", currentWidth)
        .attr("viewBox","0 0 " + currentWidth + " " + _height);

  d3.select(_svgDivId).select("#yAxis").selectAll(".tick line")
          .attr("x2", currentWidth - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1);

  d3.select(_svgDivId).select("#yAxis")
        .call(g => g.select(".domain").remove())

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
  d3.select(_svgDivId).select('svg').select("#xAxis").call(xAxis);

  //set bar x values and width
  bar
    .attr("x", (i) => {
      return xScale(X[i]);
    })
    .attr("width", xScale.bandwidth());

  d3.select(_svgDivId).selectAll(".foo")  //doesnt find anything on initial, because of animation.
    .attr("x", (i) => {
      return xScale(X[i]);
    });

  //position barText values
  d3.select(_svgDivId).select("#barText")
          .selectAll("text")
            .attr("dx", "0.15em") //use this to position on x axis
            // .attr("dx", xScale.bandwidth()/3) //use this to position on x axis
}