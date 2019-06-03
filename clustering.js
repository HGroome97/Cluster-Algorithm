let xClusterVals = [];
let yClusterVals = [];

let x_vals = [];
let y_vals = [];

let nearestCentroidDistance = [];
let nearestCentroid = [];

let numClusters = 2;

function setup() {
  createCanvas(window.innerHeight, window.innerHeight - 100);

  function randomStart() {
    return random(2) - 1;
  }
  background(0);
  strokeWeight(2);
  stroke(0, 255, 0);
  fill(0, 255, 0, 127);
  for (var i = 0; i < numClusters; i++) {
    xClusterVals.push(randomStart());
    yClusterVals.push(randomStart());
  }
}

function mapX(x) {
  return map(x, -1, 1, 0, width);
}

function mapY(y) {
  return map(y, -1, 1, height, 0);
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function distanceBetweenTwo(val1, val2) {
  return val1 - val2;
}

function findNearestCentroid() {
  nearestCentroid.length = 0;
  nearestCentroidDistance.length = 0;
  for (var i = 0; i < x_vals.length; i++) {
    var currentNearest = Number.MAX_SAFE_INTEGER;
    var currentNearestCentroidIndex = -1;
    for (var j = 0; j < numClusters; j++) {
      currentCentroid = getDistance(x_vals[i], y_vals[i], xClusterVals[j], yClusterVals[j]);
      if (currentCentroid < currentNearest) {
        currentNearest = currentCentroid;
        currentNearestCentroidIndex = j;
      }
    }
    nearestCentroidDistance.push(currentNearest);
    nearestCentroid.push(currentNearestCentroidIndex);
  }
}

function collectCentroidsDistances() {
  for (var j = 0; j < numClusters; j++) {
    var currentDistances = [];
    var pointID = [];
    for (var i = 0; i < nearestCentroid.length; i++) {
      if (nearestCentroid[i] == j) {
        currentDistances.push(nearestCentroidDistance[i]);
        pointID.push(i);
      }
    }
    //pointID for getting x, y values for moving, j for number of cluster beibng moved
    if (pointID.length != 0) {
        moveCentroid(pointID, j);
    }
  }
}

function moveCentroid(pointID, index) {
  var sumX = 0;
  var sumY = 0;
  for (var i = 0; i < pointID.length; i++) {
    sumX += xClusterVals[index] - x_vals[pointID[i]];
    sumY += yClusterVals[index] - y_vals[pointID[i]];
  }
  console.log(sumX, sumY);
  var meanX = sumX / pointID.length;
  var meanY = sumY / pointID.length;
  console.log(meanY);
  xClusterVals[index] = xClusterVals[index] - meanX;
  yClusterVals[index] = yClusterVals[index] - meanY;
}

function mousePressed() {
  x_vals.push(map(mouseX, 0, width, -1, 1));
  y_vals.push(map(mouseY, 0, height, 1, -1));
}

function draw() {
  background(0);
  strokeWeight(2);
  stroke(0, 255, 0);
  fill(0, 255, 0, 127);
  for (var i = 0; i < numClusters; i++) {
    ellipse(mapX(xClusterVals[i]), mapY(yClusterVals[i]), 25, 25);
  }

  stroke(255);
  strokeWeight(8);

  findNearestCentroid();
  collectCentroidsDistances();

  for (let i = 0; i < x_vals.length; i++) {
    let px = mapX(x_vals[i]);
    let py = mapY(y_vals[i]);
    point(px, py);
  }
}
