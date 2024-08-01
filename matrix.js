//matrix.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9 Project 1
//Profeesor - Dr. Maoyuan Sun

var rectWidth = 25;
let randomNums = [];
var rowNum;
var colNum

//
//this function handles the users form submission
//
function setvals(event) {
    event.preventDefault();               //we want to avoid refreshing the page, since we work only in frontend here, we want to keep our values.
    const form = event.currentTarget;
    rowNum = (form.rows).value;
    colNum = (form.columns).value;

    if (form.random.checked) //we want to randomize the matrix
      build(rowNum, colNum, true, false);
    else  //we do not want to randomize the matriz
      build(rowNum, colNum, false, false);

    return;
}

document.getElementById('myform').addEventListener('submit', setvals);   //listen for form input

//
//This is our most important function, it takes the row number and column number and build the matrix
//random is true or false and tells us if the matrix we are building is random or not
//isSort is true or false and tells us if the matrix we are building is sorted or not
//
function build (rowNum, colNum, random, isSort) {

    if (!isSort)
      randomNums = [];

    d3.selectAll("g").remove()

    var svg = d3.select("#array").append("svg")
    svg.style("overflow", "visible");            //make sure that no cells are cut off

    //handle our rows, append g tags for each
    var rows = svg.selectAll(".row")
      .data(d3.range(rowNum))
      .enter().append("g")
      .attr("class","row")
      .attr("transform", function(d, i) {
        return "translate(0," + (rectWidth * i) + ")";
      });


    var r_counter = 0;
    var count = 0
    var rects = rows.selectAll("rect")
    .data(d3.range(colNum))             //each row will have colNum vals
    .enter().append("rect")
    .attr("x", function(d, i) {
      return rectWidth * i;             //x value of next cell
    })
    .attr("height", rectWidth)          //we want a square so our width and height are the same
    .attr("width", rectWidth)
    .attr('stroke', 'black')
    .attr('fill', function(d, i) {

      if (isSort) {
        count++;
        index = r_counter * colNum + i;

        if(count % colNum == 0) {    //we need to go to a new row
          count = 0;
          r_counter++;
        }

        return getSortedColor(randomNums[index]);  //pick the color for that specific number
      }

      if (random && !isSort)                      //if we are not sorting, generate a random value and get color
        return getColor(randomNums);
      else
        return "#ffffff";         //if user wants a blank matrix, use white
    });

    row_count = 0;                //keep track of which row we are putting numbers on
    var counter = 0;              //keep track of which cell we are on with our row
    rows.selectAll("text")
    .data(d3.range(colNum))
    .enter().append("text")       //append the number to the cell
    .attr("x", function (d,i) {
      return 8 + 25 * i;
    })
    .attr("y", rectWidth / 2 + 4)
    .attr("fill", "black")
    .text(function(d,i) {
      counter++;

      index = row_count * colNum + i;

      if(counter % colNum == 0) {       //go to a new row
        counter = 0;
        row_count++;
      }
      return randomNums[index];         //return the random value generated for that cell
    });

    wait();              //wait for next function
}

//
//This function waits for the next form submission
//
function wait() {
    document.getElementById('myform').addEventListener('submit', setvals);
}

//
//generate a random value, pushes into randomNums array, and returns the color for that value
//this function is for generating a random colored matrix
//
function getColor(randomNums) {
    rand = Math.floor(Math.random() * 10 + 1);
    randomNums.push(rand);
    console.log(rand)
    switch (rand) {
      case 1:
        return "#ffffff";
      case 2:
        return "#66ffff";
      case 3:
        return "#0066cc";
      case 4:
        return "#000099";
      case 5:
        return "#6600cc";
      case 6:
        return "#cc0000";
      case 7:
        return "#ff6600";
      case 8:
        return "#ffff00";
      case 9:
        return "#66ff33";
      case 10:
        return "#006600"
    }
}

//
//This function returns the color for the number passed in
//Used when we are printing out a sorted matrix
//
function getSortedColor(rand) {
    switch (rand) {
      case 1:
        return "#ffffff";
      case 2:
        return "#66ffff";
      case 3:
        return "#0066cc";
      case 4:
        return "#000099";
      case 5:
        return "#6600cc";
      case 6:
        return "#cc0000";
      case 7:
        return "#ff6600";
      case 8:
        return "#ffff00";
      case 9:
        return "#66ff33";
      case 10:
        return "#006600"
    }
}

//
//this function sorts our randomNums array by row
//
function sortarray() {

    var temp = randomNums;            //hold all of the values to sort
    var sortArr = [];
    randomNums = [];                  //empty our randomNums array so we can refill it

    for (var row = 0; row < rowNum; row++) {      //1 iteration for each row
      for (var i = 0; i < colNum; i++) {          //for each value in row, push into our sortArr
        sortArr.push(temp[row * colNum + i]);
      }

      sortArr.sort(function(a, b) {return a - b;})  //We have our row, sort it

      for (var j = 0; j < colNum; j++) {            //we have our sorted row push it back into array
        randomNums.push(sortArr[j])
      }

      sortArr = [];                                 //empty our sortArr so we can use it again
    }

    //this is to handle our blank matrix case, if it was blank the whole time, just rebuild it how it was
    if (randomNums[0] === undefined) {
      build(rowNum, colNum, false, false);
    }
    //call build if we have a new matrix with a sorted array to build
    else {
      build(rowNum, colNum, true, true);
    }
}