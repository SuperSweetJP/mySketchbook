function hbc2_PrepData(_data) {
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

var svg = undefined;

function hbc2_chartProc(_data, _svgId, {
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
} = {}) {
    //prep svg
    if(svg = undefined){
        console.log('calling svg prep');
        hbc2_prepSvg(_svgId, width, height);
    }
    //set data
    //hbc2_chartData(_data);   
}

function hbc2_prepSvg(svgDivId, width, height){
    svg = d3.select(svgDivId).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
}


