var canv = document.getElementById("canv");
var ctx = canv.getContext("2d");
canv.height = 700;
canv.width = 700;
ctx.fillStyle = "white";
xpos = 350
left = false
up = false
right = false
down = false
space = false
ctrl = false
shift = false
CDCount = 0;
shots = [];
enemyShots = [];
enemies = [];
health = 100;
gamerunning = false;
money = 50;
score = 0;
lost = false;
inc = 0
min = 0;
sec = 0;
canv.style.border = "2px solid #4caf50";
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);


function keyDown(evt) {
  switch (evt.keyCode) {
    case 32:
      space = true;
      break;
    case 37:
      left = true;
      break;
    case 38:
      up = true;
      break;
    case 39:
      right = true;
      break;
    case 40:
      down = true;
      break;
    case 27:
      startGame();
      break
    case 17:
      ctrl = true
      break
    case 16:
      shift = true
      break
  }
}

function keyUp(evt) {
  switch (evt.keyCode) {
    case 32:
      space = false;
      break;
    case 37:
      left = false;
      break;
    case 38:
      up = false;
      break;
    case 39:
      right = false;
      break;
    case 40:
      down = false;
      break;
    case 17:
      ctrl = false
      break
    case 16:
      shift = false
      break
  }
}

//COLLISION
function collidesWithX(obj1, obj2) {
  if (Math.abs(obj1.xpos - obj2.xpos) < Math.abs(obj1.width - obj2.width)) {
    return true;
  }
}

function collidesWithY(obj1, obj2) {
  if (Math.abs(obj1.ypos - obj2.ypos) < (Math.abs(obj1.height - obj2.height) + Math.min(obj1.height, obj2.height))) {
    return true;
  }
}

function collidesWith(obj1, obj2) {
  return collidesWithX(obj1, obj2) && collidesWithY(obj1, obj2);
}

function filter_array(test_array) {
  var index = -1,
    arr_length = test_array ? test_array.length : 0,
    resIndex = -1,
    result = [];

  while (++index < arr_length) {
    var value = test_array[index];

    if (value) {
      result[++resIndex] = value;
    }
  }

  return result;
}
