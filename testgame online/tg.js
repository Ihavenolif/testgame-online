playerName = ""
gameName = ""
password = ""
gamesList = null
function login() {
    playerName = document.getElementById("nick").value
    lobbySelection()
}

function refresh() {
    gamesList = getGamesList()
    table.innerHTML = "<tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr>"
    i = 1
    setTimeout(() => {
        for (x in gamesList) {
            ii = 0
            row = table.insertRow(i++)
            row.insertCell(ii++).innerHTML = x
            row.insertCell(ii++).innerHTML = gamesList[x]["player1"]
            row.insertCell(ii++).innerHTML = gamesList[x]["password"] == "" ? "no" : "yes"
            row.insertCell(ii).innerHTML = "<button class=joinButton onclick=joinGame(" + "gamesList[" + "'" + x + "'" + "])>Join</button>"
        }
    }, 500);
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(xpos + 30, canv.height);
    ctx.lineTo(xpos, canv.width - 50);
    ctx.lineTo(xpos - 30, canv.height);
    ctx.lineTo(xpos + 30, canv.height);
    ctx.closePath();
    ctx.fillStyle = "#4caf50";
    ctx.fill();
}

function getGamesList() {
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText))
            gamesList = JSON.parse(this.responseText)
        }
    }
    xhttp.open("POST", "http://localhost:7000", true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        getGamesList: true
    }))
}

function createGame(gameName, password) {
    y = ""
    for (x of gameName) {
        if (x == " ") {
            y += "-"
        } else {
            y += x
        }
    }
    gameName = y
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(typeof this.responseText == Object ? this.responseText : JSON.parse(this.responseText))
        }
    }
    xhttp.open("POST", "http://localhost:7000", true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        createGame: true,
        gameName: gameName,
        password: password,
        playerName: playerName
    }))
    lobbySelection()
}

function lobbySelection() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Available games</h1><br><table id=table><tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr></table><button class=login-btn onclick=refresh()>Refresh</button><button class=login-btn onclick=createGameMenu()>Create Game</button></div>"
    refresh()
}

function gameLobby() {
    document.getElementById("content").innerHTML = ""
}

function createGameMenu() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Create a game</h1><input class=textbox placeholder=Game-name id=gameName><input class=textbox type=password placeholder=Password id=password><button onclick=getCreateGameValues();createGame(gameName,password) class=login-btn>Create Game</button></div>"
}

function getCreateGameValues() {
    gameName = document.getElementById("gameName").value
    password = document.getElementById("password").value
}

function joinGame(gameId) {
    if (playerName != gameId.player1) {
        xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(JSON.parse(this.responseText))
                //gamesList = JSON.parse(this.responseText)
            }
        }
        xhttp.open("POST", "http://localhost:7000", true)
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhttp.send(JSON.stringify({
            joinGame: true,
            name: gameId.name,
            password: gameId.password,
            player1: gameId.player1,
            player2: playerName
        }))
    } else {
        alert("You cannot connect to yourself.")
    }
}