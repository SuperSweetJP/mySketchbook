
let hbc_selectedCarMake = null;

function horiBarChart_PrepData(_data) {
    //this is needed to remove html special characters that come as a result of flasks jsonify
    var decoded = $("<div/>").html(_data).text();
    //there is still b'{json}' left, remove that via substring
    var decoded = decoded.substring(2, decoded.length-1);

    var dataObj = JSON.parse(decoded);

    //DATA SORT
    //transform object into an array
    let sortable = [];
    for (var make in dataObj) {
        sortable.push([make, dataObj[make]]);
    }
    //sort the array
    sortable.sort((a, b) => b[1] - a[1]);
    //transform back into an object
    let dataObjSorted = {}
    sortable.forEach(function(item){
    dataObjSorted[item[0]]=item[1]
    })

    return dataObjSorted;
}

//svgId
function HorizontalBarChart(data, svgDivId
    , {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    title, // given d in data, returns the title text
    marginTop = 30, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 10, // the bottom margin, in pixels
    marginLeft = 70, // the left margin, in pixels
    width = parseInt(d3.select(svgDivId).style('width'), 10), // the outer width of the chart, in pixels
    height, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    yDomain, // an array of (ordinal) y-values
    yRange, // [top, bottom]
    color = "currentColor", // bar fill color
    mouseoverColor = '#F44336',
    titleColor = "white", // title fill color when atop bar
    titleAltColor = "currentColor", // title fill color when atop background
    } = {}
    ) {
        const dataObjProcessed = horiBarChart_PrepData(data);
        const X = [], Y = [];
        for(let key in dataObjProcessed){
            if(dataObjProcessed.hasOwnProperty(key)){
                Y.push(key);
                X.push(parseInt(dataObjProcessed[key]));
            }
        }

        // Compute default domains, and unique the y-domain.
        // Array of two values, 0 and max(X)
        if (xDomain === undefined) xDomain = [0, d3.max(X)];
        //all y values
        if (yDomain === undefined) yDomain = Y;
        yDomain = new d3.InternSet(yDomain);

        // Omit any data not present in the y-domain.
        I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

        // Compute the default height.
        if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
        if (yRange === undefined) yRange = [marginTop, height - marginBottom];  

        const svg = d3.select(svgDivId).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        // Construct Y scales and axes.
        const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
        const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

        //xAxis
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`) //0 on x, 30down on y
            .attr("id", "xAxis")
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text") //this is the "frequency" on x axis
                .attr("id", "xAxisText")
                .attr("x", width - marginRight)
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(xLabel));

        //yAxis with ticks and names
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis);

        //create bars
        svg.append("g")
            .attr("id", "rect")
            .attr("fill", color)
            .selectAll("rect")
            .data(I)
            .join("rect")
            .on('mouseover', function(d) {
                    d3.select(this).attr("fill", mouseoverColor)
                })
            .on('mouseout', function(d) {
                    //keep the onMouse color for "active" selection
                    if(d3.select(this).attr("id") == hbc_selectedCarMake) {
                        d3.select(this).attr("fill", mouseoverColor); 
                    }
                    else {
                        d3.select(this).attr("fill", color);
                    }
                })
            .on('click', function(d, i) {
                    if(d3.select(this).attr("id") != hbc_selectedCarMake) {
                        //reset current selection color
                        d3.select("#" + hbc_selectedCarMake).attr("fill", color);

                        hbc_selectedCarMake = Y[i];
                        if(typeof getFrequencyData === 'function') {
                            getFrequencyData(Y[i]);
                        }
                    }
                    else {
                        //ToDo: return to all car data
                    }
                })
            .attr("y", i => yScale(Y[i]))
            .attr("height", yScale.bandwidth())
            .attr("id", i => Y[i]);

        //create barText
        svg.append("g")
            .attr("id", "barText")
            .attr("fill", titleColor)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(I)
            .join("text")
            .attr("class", "foo")
            .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -4)

        title = i => `${X[i]}`;

        return {
            marginLeft,
            marginRight,
            marginTop,
            height,
            xType,
            xDomain,
            xFormat,
            X,
            title,
            titleColor,
            titleAltColor
        }
}

function horiBarChart_ChartResize(svgDivId, {
        marginLeft,
        marginRight,
        marginTop,
        height,
        xType,
        xDomain,
        xFormat,
        X,
        title,
        titleColor,
        titleAltColor
    } = {}) {
        let svg = d3.select(svgDivId).select('svg');

        currentWidth = parseInt(d3.select(svgDivId).style('width'), 10);
        xRangeCur = [marginLeft, currentWidth - marginRight];
        svg.attr("width", currentWidth)
            .attr("viewBox","0 0 " + currentWidth + " " + height)

        //recalculate scale and axis for x
        var xScale = xType(xDomain, xRangeCur);  //x will be updated based on current window size.
        var xAxis = d3.axisTop(xScale).ticks(currentWidth / 80, xFormat); //how many ticks to display.

        //update x axis with new values
        svg.select("#xAxis").attr("transform", `translate(0,${marginTop})`).call(xAxis) //0 on x, 30down on y;
        svg.select("#xAxisText")
            .attr("x", currentWidth - marginRight)
            .attr("y", -22)

        // update the bar size
        d3.select(svgDivId).selectAll("rect")
            .data(I)
            .attr("x", xScale(0))
            .attr("width", i => xScale(X[i]) - xScale(0));

        //this can be done differently for my example, where I don't need xscale
        //hence don't need to redo all of these. Or at least the part above.
        d3.select(svgDivId).selectAll(".foo")
            .data(I)
            .attr("x", i => xScale(X[i]))
            .text(title)
                .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 25) // short bars
                    .attr("dx", +4)
                    .attr("fill", titleAltColor)
                    .attr("text-anchor", "start"))
                .call(text => text.filter(i => xScale(X[i]) - xScale(0) >= 25) // long bars
                    .attr("dx", -4)
                    .attr("fill", titleColor)
                    .attr("text-anchor", "end"));
}

