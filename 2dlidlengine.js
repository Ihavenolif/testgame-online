/*
---VARIABLES---
---SINGLEPLAYER ONLY---
---DEPRECATED---
*/

ctx.fillStyle = "white";
xpos = 350
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
min = 0
sec = 0
canv.style.border = "2px solid #4caf50";


function engineLoad(){
  window.canv = document.getElementById("canv");
  window.ctx = canv.getContext("2d");
  window.canv.style.border = "2px solid #4caf50";
  window.canv.height = 700;
  window.canv.width = 700;
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  window.left = false 
  window.right = false 
  window.up = false 
  window.down = false 
  window.shift = false 
  window.ctrl = false 
  window.space = false 
}

function wsSendKeyInfo(pressed, key){
  ws.send(JSON.stringify({
    gameName: gameName,
    player: player,
    request: "buttonPress",
    pressed: pressed,
    button: key
  }))
}

function keyDown(evt) {
  switch (evt.keyCode) {
    case 32:
      wsSendKeyInfo(true, "space")
      space = true;
      break;
    case 37:
      wsSendKeyInfo(true, "left")
      left = true;
      break;
    case 38:
      wsSendKeyInfo(true, "up")
      up = true;
      break;
    case 39:
      wsSendKeyInfo(true, "right")
      right = true;
      break;
    case 40:
      wsSendKeyInfo(true, "down")
      down = true;
      break;
    case 27:
      startGame();
      break
    case 17:
      wsSendKeyInfo(true, "ctrl")
      ctrl = true
      break
    case 16:
      wsSendKeyInfo(true, "shift")
      shift = true
      break
    case 49:
      yellowSoldierSpawn()
      break
    case 50:
      blueSoldierSpawn()
      break
  }
}

function keyUp(evt) {
  switch (evt.keyCode) {
    case 32:
      wsSendKeyInfo(false, "space")
      space = false;
      break;
    case 37:
      wsSendKeyInfo(false, "left")
      left = false;
      break;
    case 38:
      wsSendKeyInfo(false, "up")
      up = false;
      break;
    case 39:
      wsSendKeyInfo(false, "right")
      right = false;
      break;
    case 40:
      wsSendKeyInfo(false, "down")
      down = false;
      break;
    case 17:
      wsSendKeyInfo(false, "ctrl")
      ctrl = false
      break
    case 16:
      wsSendKeyInfo(false, "shift")
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
