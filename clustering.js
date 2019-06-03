let xClusterVals = [];
let yClusterVals = [];

let y_vals = [];
let x_vals = [];

let nearestCentroid = [];
let nearestCentroidDistance = [];

let furthestCentroidDistance = [];

let numClusters = 5;

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

function mapXDistance(x) {
  return map(x, 0, 2, 0, width);
}

function mapY(y) {
  return map(y, -1, 1, height, 0);
}

function mapYDistance(y) {
  return map(y, 0, 2, 0, height);
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function distanceBetweenTwo(val1, val2) {
  return Math.sqrt(Math.pow(val1, 2) + Math.pow(val2, 2));
}

function findNearestCentroid() {
  nearestCentroid.length = 0;
  nearestCentroidDistance.length = 0;
  for (var i = 0; i < x_vals.length; i++) {
    var currentNearest = Number.MAX_SAFE_INTEGER;
    var currentFurthest = 0;
    var currentNearestCentroidIndex = -1;
    for (var j = 0; j < numClusters; j++) {
      currentCentroid = getDistance(x_vals[i], y_vals[i], xClusterVals[j], yClusterVals[j]);
      if (currentCentroid < currentNearest) {
        currentNearest = currentCentroid;
        currentNearestCentroidIndex = j;
      }
      if (currentCentroid > currentFurthest) {
        currentFurthest = currentCentroid;
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
    if (pointID.length != 0) {
      moveCentroid(pointID, j);
    }
  }
}

function moveCentroid(pointID, index) {
  var sumX = 0;
  var sumY = 0;
  var currentFurthest = 0;
  for (var i = 0; i < pointID.length; i++) {
    var xDistance = xClusterVals[index] - x_vals[pointID[i]];
    var yDistance = yClusterVals[index] - y_vals[pointID[i]];
    var currentDistance = distanceBetweenTwo(xDistance, yDistance);
    if (currentDistance > currentFurthest) {
      currentFurthest = currentDistance;
    }
    sumX += xDistance;
    sumY += yDistance;
  }
  var meanX = sumX / pointID.length;
  var meanY = sumY / pointID.length;
  if (pointID.length == 1) {
    furthestCentroidDistance[index] = 0.0375;
  } else {
    furthestCentroidDistance[index] = currentFurthest;
  }
  xClusterVals[index] = xClusterVals[index] - meanX;
  yClusterVals[index] = yClusterVals[index] - meanY;
}

function mousePressed() {
  x_vals.push(map(mouseX, 0, width, -1, 1));
  y_vals.push(map(mouseY, 0, height, 1, -1));
}

function draw() {
  findNearestCentroid();
  collectCentroidsDistances();

  background(0);
  strokeWeight(2);
  stroke(0, 255, 0);
  fill(0, 255, 0, 127);
  for (var i = 0; i < numClusters; i++) {
    if (furthestCentroidDistance[i] == null) {
      ellipse(mapX(xClusterVals[i]), mapY(yClusterVals[i]), 25, 25);
    } else {
      ellipse(mapX(xClusterVals[i]), mapY(yClusterVals[i]), mapXDistance(furthestCentroidDistance[i])*2, mapYDistance(furthestCentroidDistance[i])*2);
    }
  }

  stroke(255);
  strokeWeight(8);

  for (let i = 0; i < x_vals.length; i++) {
    let px = mapX(x_vals[i]);
    let py = mapY(y_vals[i]);
    point(px, py);
  }
}
