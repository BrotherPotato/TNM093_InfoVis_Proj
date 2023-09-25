// https://www.d3-graph-gallery.com/graph/interactivity_brush.html

function labcode(data, x_var, y_var, sp_svg, tooltip) {

  //------------------------------------------------------------------------------------->
  /** COMPUTER EXERCISE STARTS HERE  */
  //Task 5.1.1  -- Create the x-axis
  var x;
  // d3.scaleLinear() creates a linear scale 
  // d3.domain() sets the input domain of the scale (the minimum and maximum values of the input)
  // d3.range() creates a range of values from 0 to width
  x = d3.scaleLinear().domain([0, 100]).range([0, width])

  //Task 5.1.2  -- Append the axes to the svg
  var xAxis;
  // .append("g") appends a new element with the specified name as the last child of each element in the current selection
  // .attr("transform", "translate(0," + height + ")") moves the axis to the bottom of the svg
  // d3.axisBottom(x) creates a bottom-oriented axis generator for the given scale x
  xAxis = sp_svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

  //Task 5.1.3  -- Create y-axis
  var y;
  y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  // Task 5.1.4 -- Append the axis to svg  ("transform", "translate(0,0)").call(d3.axisLeft(y))
  var yAxis;
  yAxis = sp_svg.append("g").attr("transform", "translate(0, 0)").call(d3.axisLeft(y))

  // Task 5.1.5 -- Append circles to svg
  var myCircles;
  // .selectAll("circle") selects all circles
  // .data(data) binds data to the selected elements
  // .enter() creates placeholders for missing elements
  // .append("circle") appends a circle for each missing element
  myCircles = sp_svg.append('g').selectAll("circle").data(data).enter().append("circle")

  // Task 5.1.6 -- Append circles to svg
  // .attr("cx", function (d) { return x(+d[x_var]); }) sets the x position of the circle
  // .attr("cy", function (d) { return y(+d[y_var]); }) sets the y position of the circle
  // .attr("r", 6) sets the radius of the circle
  // .style("opacity", '0.3') sets the opacity of the circle
  // .style("stroke", "darkturquoise") sets the color of the stroke of the circle
  // .style("stroke-width", "1") sets the width of the stroke of the circle
  // .style("fill", "darkturquoise") sets the color of the circle
  myCircles.attr("cx", function (d) { return x(+d[x_var]); })
    .attr("cy", function (d) { return y(+d[y_var]); }).
    attr("r", 6).
    style("opacity", '0.3').
    style("stroke", "darkturquoise").
    style("stroke-width", "1").
    style("fill", "darkturquoise")

  // Task 5.1.7 -- Adding hovering
  myCircles.on("mouseover", function (d) {
    focusCircle(d)
  })

  return [x, xAxis, y, yAxis, myCircles];
}
//------------------------------------------------------------------------------------->
/** COMPUTER EXERCISE ENDS HERE  **/

/** NECESSARY FUNCTION. DO NOT TOUCH */
function sp(data) {

  const features = data.columns;
  // Take the second column as default (exclude first column)
  const defaultX = features[1].toString();
  const defaultY = features[1].toString();

  var x_var = defaultX;
  var y_var = defaultY;

  var vars = []

  // Skipping the first feature
  for (i = 1; i < features.length; i++) {
    vars.push(features[i])
  }

  var dropDownX = d3.select("#dropdownX")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultX;
    })
    .text(function (d) { return d; }) // Text showed in the menu
    .attr("value", function (d) { return d; }) // Corresponding value returned by the button

  var dropDownY = d3.select("#dropdownY")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultY;
    })
    .text(function (d) { return d; }) // Text showed in the menu
    .attr("value", function (d) { return d; }) // Corresponding value returned by the button

  var margin = { top: 10, right: 40, bottom: 10, left: 60 },
    width = $('div.sp-container').width(),
    height = $('div.sp-container').height();

  var sp_svg = d3.select("#sp")
    .append("svg")
    .attr('viewBox', '0 0 ' + (
      width + margin.left + margin.right)
      + ' ' + (height + margin.top + margin.bottom))
    .attr('width', '100%')
    .attr('height', height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Tooltip
  var tooltip = d3.select("#sp").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  /**
   * Scatter Plot (here is where your code is used for the scatter plot)
   */
  var values = labcode(data, x_var, y_var, sp_svg, tooltip);

  var x = values[0];
  var xAxis = values[1];
  var y = values[2];
  var yAxis = values[3];
  var myCircles = values[4];

  this.selectDot = function (value) {
    //Call focusCircle
    focusCircle(value)
  }

  this.resetSelectDot = function () {
    d3.selectAll("circle")
      .style("fill", "darkturquoise")
      .style("opacity", '0.3')
      .attr('r', 6)
  }

  // A function that update the chart
  function update(selectedX, selectedY) {
    x.domain([
      d3.min(data, function (d) { return +d[selectedX]; }),
      d3.max(data, function (d) { return +d[selectedX]; })
    ])
    xAxis
      .transition()
      .duration(400)
      .call(d3.axisBottom(x))

    y.domain([
      d3.min(data, function (d) { return +d[selectedY] }),
      d3.max(data, function (d) { return +d[selectedY] })
    ])
    yAxis
      .transition()
      .duration(400)
      .call(d3.axisLeft(y))

    // Give these new data to update 
    myCircles
      .data(data)
      .transition()
      .duration(400)
      .attr("cx", function (d) { return x(+d[selectedX]); })
      .attr("cy", function (d) { return y(+d[selectedY]); })
  }

  d3.selectAll("#dropdownX, #dropdownY").on("change", function (d) {

    // Recover the option that has been chosen
    var selectedOptionX = d3.select("#dropdownX").property("value")
    var selectedOptionY = d3.select("#dropdownY").property("value")
    update(selectedOptionX, selectedOptionY)
  })
}

function hovering(myCircles, tooltip) {
  myCircles.on("mouseover", function (d) {
    focusCircle(d.Region)
    pc.selectLine(d.Region)
    tooltip
      .style("opacity", 1)
      .html("Region: " + d.Region)
      .style("left", (d3.mouse(this)[0] + 25) + "px") // It is important to put the +25: else the tooltip is exactly where the mouse is 
      .style("top", (d3.mouse(this)[1] - 25) + "px")

  })
    .on("mouseleave", function (d) {
      pc.resetSelectLine()
      d3.selectAll("circle")
        .style("fill", "darkturquoise")
        .style("opacity", '0.3')
        .attr('r', 6);
      tooltip
        .transition()
        .duration(50)
        .style("opacity", 0)
    })
}

function focusCircle(circle) {
  var d = d3.selectAll("circle");
  d.style("fill", function (d) {
    return d.Region == circle ? "deeppink" : 'darkturquoise';
  })
    .style("opacity", function (d) {
      return d.Region == circle ? "1.0" : '0.3';
    })
    .attr("r", function (d) {
      return d.Region == circle ? 10 : 6;
    })
    .style("stroke-width", function (d) {
      return d.Region == circle ? 1 : 0;
    })
}
/**END OF SP*/