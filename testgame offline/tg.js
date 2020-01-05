pistolLevel = 1;
pistolUpgradeCost = 50;
pistolRechargeTime = 1;
bulletLevel = 1;
bulletUpgradeCost = 50;
bulletWidth = 4;
damageLevel = 1;
damageUpgradeCost = 100;
enemySpawnTime = 180;
spawnCD = 180;
laserPointer = false;
weaponDamage = 15;
laserGun = false;
shotTimeRemaining = 0
pushUpgradeCost = 50
pushCooldown = 0
pushRemainingCooldown = 0
pushLevel = 0
freezeUpgradeCost = 50
freezeCooldown = 0
freezeRemainingCooldown = 0
freezeLevel = 0
freezeDuration = 0
freezeRemainingDuration = 0
explosionUpgradeCost = 50
explosionCooldown = 0
explosionRemainingCooldown = 0
explosionLevel = 0
explosionDamage = 0

document.addEventListener("keydown", keyDown2)

function keyDown2(evt) {
  switch (evt.keyCode) {
    case 49:
      upgradePistol()
      break
    case 50:
      upgradeBullet()
      break
    case 51:
      upgradeDamage()
      break
    case 52:
      buyLaserPointer()
      break
    case 81:
      if (!shift) abilityPush()
      else purchasePush()
      break
    case 87:
      if (!shift) abilityFreeze()
      else purchaseFreeze()
      break
    case 69:
      if (!shift) abilityExplosion()
      else purchaseExplosion()
      break
    case 82:
      if (!shift) abilityR()
      else purchaseR()
      break
  }
}

function purchasePush() {
  if (pushLevel <= 3 && money >= pushUpgradeCost) {
    money -= pushUpgradeCost
    pushLevel++
    switch (pushCooldown) {
      case 0:
        pushCooldown = 15
        break
      case 15:
        pushCooldown = 12
        break
      case 12:
        pushCooldown = 9
        break
    }

    switch (pushUpgradeCost) {
      case 50:
        pushUpgradeCost = 100
        break
      case 100:
        pushUpgradeCost = 150
        break
      case 150:
        pushUpgradeCost = "MAX"
        document.getElementById("pushIcon").src = "pushIconMax.png"
        break
    }

    document.getElementById("pushLevel").innerHTML = "Level: " + pushLevel
    document.getElementById("pushUpgradeCost").innerHTML = "$" + pushUpgradeCost
    document.getElementById("pushCooldown").innerHTML = "Cooldown:<br>" + pushCooldown + "s"
    document.getElementById("pushCooldown").style = ""
  }
}

function abilityPush() {
  if (pushLevel > 0 && pushRemainingCooldown == 0) {
    for (x of enemies) {
      x.ypos = 0
    }
    pushRemainingCooldown = pushCooldown
  }
}

function purchaseFreeze() {
  if (freezeLevel <= 3 && money >= freezeUpgradeCost) {
    money -= freezeUpgradeCost
    freezeLevel++
    switch (freezeCooldown) {
      case 0:
        freezeCooldown = 20
        break;
      case 20:
        freezeCooldown = 18
        break
      case 18:
        freezeCooldown = 15
        break
    }
    switch (freezeDuration) {
      case 0:
        freezeDuration = 2
        break
      case 2:
        freezeDuration = 3
        break
      case 3:
        freezeDuration = 4
        break
    }
    switch (freezeUpgradeCost) {
      case 50:
        freezeUpgradeCost = 100
        break
      case 100:
        freezeUpgradeCost = 150
        break
      case 150:
        freezeUpgradeCost = "MAX"
        document.getElementById("freezeIcon").src = "freezeIconMax.png"
        break
    }
    document.getElementById("freezeLevel").innerHTML = "Level: " + freezeLevel
    document.getElementById("freezeUpgradeCost").innerHTML = "$" + freezeUpgradeCost
    document.getElementById("freezeCooldown").innerHTML = "Cooldown:<br>" + freezeCooldown
    document.getElementById("freezeCooldown").style = ""
    document.getElementById("freezeDuration").innerHTML = "Duration:<br>" + freezeDuration + "s"
    document.getElementById("freezeDuration").style = ""
  }
}

function purchaseExplosion() {
  if (explosionLevel <= 2 && money >= explosionUpgradeCost) {
    money -= explosionUpgradeCost
    explosionLevel++
    switch (explosionCooldown) {
      case 0:
        explosionCooldown = 30
        break;
      case 30:
        explosionCooldown = 25
        break
    }
    switch (explosionDamage) {
      case 0:
        explosionDamage = 15
        break
      case 15:
        explosionDamage = 20
        break
    }
    switch (explosionUpgradeCost) {
      case 50:
        explosionUpgradeCost = 100
        break
      case 100:
        explosionUpgradeCost = "MAX"
        document.getElementById("explosionIcon").src = "explosionIconMax.png"
        break
    }
    document.getElementById("explosionLevel").innerHTML = "Level: " + explosionLevel
    document.getElementById("explosionUpgradeCost").innerHTML = "$" + explosionUpgradeCost
    document.getElementById("explosionCooldown").innerHTML = "Cooldown:<br>" + explosionCooldown
    document.getElementById("explosionCooldown").style = ""
    document.getElementById("explosionDamage").innerHTML = "Damage:<br>" + explosionDamage
    document.getElementById("explosionDamage").style = ""
  }
}

function abilityExplosion() {
  if (explosionRemainingCooldown == 0) {
    for (x of enemies) {
      if (x.health <= explosionDamage) {
        x.alive = 0
        switch (x.type) {
          case 1:
            money += 5;
            score += 5;
            break;
          case 2:
            money += 15;
            score += 15;
            break;
          case "BOSS":
            money += 100
            score += 100
        }
      } else {
        x.health -= explosionDamage
      }
    }
    explosionRemainingCooldown = explosionCooldown
  }
}

function abilityFreeze() {
  if (freezeLevel > 0 && freezeRemainingCooldown == 0) {
    freezeRemainingCooldown = freezeCooldown
    freezeRemainingDuration = freezeDuration
  }
}

function game() {
  if (left && xpos >= 0) {
    if (shift && ctrl || !shift && !ctrl) xpos -= 6
    if (shift && !ctrl) xpos -= 12
    if (!shift && ctrl) xpos -= 3
  }
  if (right && xpos <= 700) {
    if (shift && ctrl || !shift && !ctrl) xpos += 6
    if (shift && !ctrl) xpos += 12
    if (!shift && ctrl) xpos += 3
  }

  if (space) {
    shoot();
  }

  if (CDCount > 0) CDCount--;

  for (x of shots) {
    x.ypos -= 10;
  }

  for (x of enemies) {
    if (freezeRemainingDuration == 0) {
      switch (x.type) {
        case 1:
          x.ypos += 3
          break;
        case 2:
          x.ypos += 2
          break;
        case "BOSS":
          x.move()
          x.shoot(x.xpos)
          x.switchDirection()
      }
    }
  }

  for (shotId of shots) {
    if (collidesWithY(shotId, { height: 0, ypos: 0 })) shotId.alive = 0; //WHENEVER A SHOT EXITS THE MAP
    for (enemyId of enemies) {

      if (collidesWith(shotId, enemyId)) { //WHENEVER COLLIDES WITH BULLET
        if (enemyId.health <= weaponDamage) { //IF HEALTH IS LOWER THAN WEAPON DAMAGE -> KILL
          shotId.alive = 0
          enemyId.alive = 0
          switch (enemyId.type) {
            case 1:
              money += 5;
              score += 5;
              break;
            case 2:
              money += 15;
              score += 15;
              break;
            case "BOSS":
              money += 100
              score += 100
          }
          document.getElementById("money").innerHTML = "Money: " + money
        } else {
          enemyId.health -= weaponDamage;
          shotId.alive = 0;
        }
      }
    }
  }

  for (enemyId of enemies) {
    if (enemyId.ypos >= 670) { //WHENEVER ENEMY HITS THE PLAYER
      enemyId.alive = 0
      switch (enemyId.type) {
        case 1:
          health -= 10;
          break;
        case 2:
          health -= 20;
          break;
      }
      document.getElementById("health").innerHTML = "Health: " + health
    }
  }

  for (enemyShotId of enemyShots) {
    enemyShotId.ypos += 8
    if (collidesWith(enemyShotId, { xpos: xpos, width: 60, ypos: 700, height: 30 })) { // WHENEVER ENEMY SHOT HITS THE PLAYER
      enemyShotId.alive = 0
      health -= 15
      document.getElementById("health").innerHTML = "Health: " + health
    }
  }

  shots = filter_array2(shots)
  enemies = filter_array2(enemies)
  enemyShots = filter_array2(enemyShots)

  if (health <= 0) {
    gamerunning = false;
    lost = true;
    alert("You Lost! Total score: " + score)
  }

  enemySpawn()
  draw()
}

function shoot() {
  if (CDCount == 0 && !laserGun) {
    shots.push({
      xpos: xpos,
      ypos: 650,
      width: bulletWidth,
      height: 20,
      id: shots.length,
      alive: 1
    });
    CDCount = pistolRechargeTime * 60;
  } else if (CDCount == 0 && laserGun) {
    for (enemyId of enemies) {
      if (collidesWithX(enemyId, { xpos: xpos, width: bulletWidth })) {
        if (enemyId.health <= weaponDamage) { //IF HEALTH IS LOWER THAN WEAPON DAMAGE -> KILL
          enemyId.alive = 0
          switch (enemyId.type) {
            case 1:
              money += 5;
              score += 5;
              break;
            case 2:
              money += 15;
              score += 15;
              break;
          }
          document.getElementById("money").innerHTML = "Money: " + money
        } else {
          enemyId.health -= weaponDamage;
        }
      }
    }
    CDCount = pistolRechargeTime * 60;
    shotTimeRemaining = 3
  }
}

function enemySpawn() {
  if (spawnCD <= 0) {
    enemyType = Math.floor(Math.random() * 100);
    if (enemyType > 75) {
      enemies.push({
        xpos: Math.floor(Math.random() * 700),
        ypos: 0,
        width: 30,
        height: 30,
        id: enemies.length,
        type: 2,
        alive: 1,
        health: 20
      })
    } else if (enemyType <= 75) {
      enemies.push({
        xpos: Math.floor(Math.random() * 700),
        ypos: 0,
        width: 20,
        height: 20,
        id: enemies.length,
        type: 1,
        alive: 1,
        health: 10
      });
    }

    enemySpawnTime *= 0.995
    spawnCD = enemySpawnTime

  }
  spawnCD--
}

function spawnBoss() {
  enemies.push({
    height: 15,
    width: 60,
    type: "BOSS",
    health: 80,
    ypos: 0,
    xpos: Math.floor(Math.random() * 700),
    direction: Math.floor(Math.random() * 10) >= 5 ? "left" : "right",
    move: function () {
      if (this.direction == "right") {
        if (this.xpos <= 700) {
          this.xpos += 2
        } else {
          this.direction = "left"
        }
      } else if (this.direction == "left") {
        if (this.xpos >= 0) {
          this.xpos -= 2
        } else {
          this.direction = "right"
        }
      }
    },
    shootCD: 120,
    shoot: function (shotXpos) {
      if (this.shootCD == 0) {
        this.shootCD = 120
        enemyShots.push({
          ypos: 0,
          xpos: shotXpos,
          width: 3,
          height: 20,
          alive: 1
        })
      }
      this.shootCD--
    },
    switchDirection: function () {
      if (Math.floor(Math.random() * 500) < 1) {
        this.direction == "right" ? this.direction = "left" : this.direction = "right"
      }

    },
    alive: 1
  })
}

function filter_array2(test_array) {
  result = []
  for (x = 0; x < test_array.length; x++) {
    if (test_array[x].alive == 1) {
      result.push(test_array[x])
    }
  }
  return result;
}

function upgradePistol() {
  if (pistolLevel < 6 && money >= pistolUpgradeCost) {
    money -= pistolUpgradeCost
    pistolLevel++
    switch (pistolUpgradeCost) {
      case 50:
        pistolUpgradeCost = 80 //R2
        break
      case 80:
        pistolUpgradeCost = 110 //R3
        break
      case 110:
        pistolUpgradeCost = 150 //R4
        break
      case 150:
        pistolUpgradeCost = 200 //R5
        break
      case 200:
        pistolUpgradeCost = 250 //R6
        document.getElementById("pistolIcon").src = "pistolIconMax.png"
        break
    }

    pistolRechargeTime = Math.round((pistolRechargeTime - 0.1) * 10) / 10

  } else if (pistolLevel == 6 && money >= pistolUpgradeCost) {
    pistolLevel = 1
    laserGun = true
    money -= pistolUpgradeCost
    document.getElementById("pistolIcon").src = "laserIcon.png"
    pistolUpgradeCost = "MAX"
  }

  document.getElementById("money").innerHTML = "Money: " + money
  document.getElementById("pistolLevel").innerHTML = "Level " + pistolLevel
  document.getElementById("pistolUpgradeCost").innerHTML = "$" + pistolUpgradeCost
  document.getElementById("pistolRecharge").innerHTML = "Recharge:<br>" + pistolRechargeTime + "s"
}

function upgradeBullet() {
  if (bulletLevel < 5 && money >= bulletUpgradeCost) {
    money -= bulletUpgradeCost
    bulletLevel++
    switch (bulletUpgradeCost) {
      case 50:
        bulletUpgradeCost = 80 //R2
        break
      case 80:
        bulletUpgradeCost = 110 //R3
        break
      case 110:
        bulletUpgradeCost = 150 //R4
        break
      case 150:
        bulletUpgradeCost = "MAX" //R5
        document.getElementById("bulletIcon").src = "bulletIconMax.png"
        break
    }
    bulletWidth++
    document.getElementById("money").innerHTML = "Money: " + money
    document.getElementById("bulletLevel").innerHTML = "Level " + bulletLevel
    document.getElementById("bulletUpgradeCost").innerHTML = "$" + bulletUpgradeCost
    document.getElementById("bulletWidth").innerHTML = "Width:<br>" + bulletWidth + "px"

  }
}

function upgradeDamage() {
  if (damageLevel < 5 && money >= damageUpgradeCost) {
    money -= damageUpgradeCost
    damageLevel++
    switch (damageUpgradeCost) {
      case 100:
        damageUpgradeCost = 150;
        weaponDamage += 5
        break
      case 150:
        damageUpgradeCost = 200
        weaponDamage += 7
        break
      case 200:
        damageUpgradeCost = "MAX"
        weaponDamage += 10
        document.getElementById("bulletDamageIcon").src = "bulletDamageIconMax.png"
        break
    }
    document.getElementById("money").innerHTML = "Money: " + money
    document.getElementById("bulletDamageLevel").innerHTML = "Level " + damageLevel
    document.getElementById("bulletDamageUpgradeCost").innerHTML = "$" + damageUpgradeCost
    document.getElementById("bulletDamage").innerHTML = "Damage:<br>" + weaponDamage
  }
}

function buyLaserPointer() {
  if (money >= 100) {
    laserPointer = true;
    money -= 100
    document.getElementById("scopeIcon").src = "scopeIconPurchased.png"
    document.getElementById("money").innerHTML = "Money: " + money
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 700, 700);
  ctx.beginPath();
  ctx.moveTo(xpos + 30, canv.height);
  ctx.lineTo(xpos, canv.width - 50);
  ctx.lineTo(xpos - 30, canv.height);
  ctx.lineTo(xpos + 30, canv.height);
  ctx.closePath();
  ctx.fillStyle = "#4caf50";
  ctx.fill();

  for (index of shots) {
    ctx.fillStyle = "red";
    ctx.fillRect(index.xpos - bulletWidth / 2, index.ypos, bulletWidth, 20);
  }

  for (index of enemies) {
    switch (index.type) {
      case 1:
        ctx.fillStyle = "yellow";
        ctx.fillRect(index.xpos - 10, index.ypos, 20, 20);
        break;
      case 2:
        ctx.fillStyle = "blue";
        ctx.fillRect(index.xpos - 15, index.ypos, 30, 30);
        break;
      case "BOSS":
        ctx.fillStyle = "red"
        ctx.fillRect(index.xpos - 30, index.ypos + 7, 60, 7)
        break
    }
  }

  for (index of enemyShots) {
    ctx.fillStyle = "red"
    ctx.fillRect(index.xpos - index.width / 2, index.ypos, index.width, index.height)
  }

  if (laserPointer) {
    ctx.strokeStyle = "#fcba03";
    ctx.beginPath();
    ctx.moveTo(xpos, 670)
    ctx.lineTo(xpos, 0)
    ctx.stroke();
  }

  if (shotTimeRemaining > 0) {
    shotTimeRemaining--
    ctx.fillStyle = "#34ebe5"
    ctx.fillRect(xpos - bulletWidth / 2, 0, bulletWidth, 670)
  }
}

function updateTime() {
  if (gamerunning) {
    inc++;
    if (pushRemainingCooldown > 0) pushRemainingCooldown--
    if (freezeRemainingCooldown > 0) freezeRemainingCooldown--
    if (freezeRemainingDuration > 0) freezeRemainingDuration--
    if (explosionRemainingCooldown > 0) explosionRemainingCooldown--
    document.getElementById("pushCooldown").innerHTML = "Cooldown:<br>" + pushRemainingCooldown + "/" + pushCooldown
    document.getElementById("freezeCooldown").innerHTML = "Cooldown:<br>" + freezeRemainingCooldown + "/" + freezeCooldown
    document.getElementById("explosionCooldown").innerHTML = "Cooldown:<br>" + explosionRemainingCooldown + "/" + explosionCooldown
    sec = inc;
    if (sec == 60) {
      sec -= 60;
      inc -= 60;
      min++;
      spawnBoss()
    }
    if (min.toString().length == 1) {
      min = "0" + min;
    }
    if (sec.toString().length == 1) {
      sec = "0" + sec;
    }

    document.getElementById("cas").innerHTML = min + ":" + sec;
  }
}

setInterval(() => {
  if (gamerunning) game()
}, 1000 / 60);
setInterval(updateTime, 1000);