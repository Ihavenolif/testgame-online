ip = ""
playerName = ""
gameName = ""
password = ""
player = null
gamesList = null
gameObj = {}

ws = null

function serverInputHandler(evt) {
    console.log(evt.data)
    input = JSON.parse(evt.data)
    switch (input.request) {
        case "loginSuccessful":
            console.log(input.message)
            window.connectionSuccessful = true
            lobbySelection()
            break
        case "gamesList":
            gamesList = input
            table.innerHTML = "<tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr>"
            i = 1
            for (x in gamesList) {
                if (x == "request") continue
                ii = 0
                row = table.insertRow(i++)
                row.insertCell(ii++).innerHTML = x
                row.insertCell(ii++).innerHTML = gamesList[x]["player1"]
                row.insertCell(ii++).innerHTML = gamesList[x]["password"]
                row.insertCell(ii).innerHTML = "<button class=joinButton onclick=joinGame(" + "gamesList[" + "'" + x + "'" + "])>Join</button>"
            }
            break
        case "createGame":
            if (input.request == "createGame") {
                gameLobby(playerName, "Waiting for another player", 1)
                window.player = 1
                window.gameName = input.gameName
            } else {
                alert("Game already exists!")
            }
            break
        case "joinGame":
            console.log(input)
            gameLobby(input.player1, playerName, 2)
            window.gameName = input.name
            window.player = 2
            break
        case "checkGameStatus":
            if (player == 1) {
                if (!input.player2 == "") {
                    document.getElementById("name2").innerHTML = input.player2
                }
                if (input.player2ready) {
                    document.getElementById("readyImg").src = "ready.png"
                } else {
                    document.getElementById("readyImg").src = "notReady.png"
                }
            } else {
                if (input.player1ready) {
                    document.getElementById("readyImg").src = "ready.png"
                } else {
                    document.getElementById("readyImg").src = "notReady.png"
                }
            }
            if (input.gameStarted) {
                clearInterval(checkGameStatus)
                createGameField()
                engineLoad()
                clearInterval(checkGameStatus)
                checkGameStatus = setInterval(game, 1000 / 60);
            }
            break
        case "readyCheck":
            if (player == 1) {
                if(input.player1ready){
                    document.getElementById("readyCheckButton").innerHTML = "Ready"
                }else{
                    document.getElementById("readyCheckButton").innerHTML = "Not Ready"
                }
                if (input.player2ready) {
                    document.getElementById("readyImg").src = "ready.png"
                } else {
                    document.getElementById("readyImg").src = "notReady.png"
                }
            } else {
                if(input.player2ready){
                    document.getElementById("readyCheckButton").innerHTML = "Ready"
                }else{
                    document.getElementById("readyCheckButton").innerHTML = "Not Ready"
                }
                if (input.player1ready) {
                    document.getElementById("readyImg").src = "ready.png"
                } else {
                    document.getElementById("readyImg").src = "notReady.png"
                }
            }
            break
        case "game":
            gameObj = input
            break
    }
}

function selectServer() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=customConnectionSettings()>Connect to a custom server</button></div></div></div>"
}

function login() {
    playerName = document.getElementById("nick").value
    selectServer()
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
    ws.send(JSON.stringify({
        request: "getGamesList"
    }))
}

function createGame(gameName, password) {
    gameName = gameName.replace(" ", "-")
    ws.send(JSON.stringify({
        request: "createGame",
        gameName: gameName,
        password: password,
        playerName: playerName
    }))

}

function lobbySelection() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Available games</h1><br><table id=table><tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr></table><button class=login-btn onclick=getGamesList()>Refresh</button><button class=login-btn onclick=createGameMenu()>Create Game</button></div>"
    getGamesList()
}

function gameLobby(name1, name2, player) {
    console.log("game lobby called")
    if (player == 1) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Not Ready</button></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><img id=readyImg class=readyImg src=notReady.png></div><div></div>"
    } else if (player == 2) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><br><img id=readyImg class=readyImg src=notReady.png></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Not Ready</button></div><div></div>"
    }

    checkGameStatus = setInterval(() => {
        ws.send(JSON.stringify({
            request: "checkGameStatus",
            gameName: window.gameName
        }))
    }, 500);
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
        if (gameId.password == "no") {
            ws.send(JSON.stringify({
                request: "joinGame",
                name: gameId.name,
                password: "",
                playerName: playerName
            }))
        } else {
            ws.send(JSON.stringify({
                request: "joinGame",
                name: gameId.name,
                password: prompt("Enter game password"),
                playerName: playerName
            }))
        }
    } else {
        alert("You cannot connect to yourself.")
    }
}

function connectOfficial() {
    connectionSuccessful = false

    window.ws = new WebSocket("https://testgame-server.herokuapp.com/")
    ws.onopen = () => {
        ip = "https://testgame-server.herokuapp.com/"
        ws.send(JSON.stringify({
            request: "login",
            playerName: window.playerName
        }))
    }

    ws.onclose = () => { alert("Connection lost!") }
    ws.onmessage = (evt) => { serverInputHandler(evt) }

    setTimeout(() => {
        if (!connectionSuccessful) {
            alert("Connection failed")
            document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=connectCustom()>Connect to a custom server</button></div></div></div>"
        }
    }, 10000);
}

function connectCustom() {
    if (document.getElementById("ipCache").value.startsWith("localhost") || document.getElementById("ipCache").value.startsWith("192")) { //when connecting using a local network (not using WSS protocol)
        cacheIP = "ws://" + document.getElementById("ipCache").value
    } else {
        cacheIP = "wss://" + document.getElementById("ipCache").value
    }
    window.connectionSuccessful = false

    window.ws = new WebSocket(cacheIP)
    ws.onclose = () => { alert("Connection lost!") }
    ws.onopen = () => {
        ws.send(JSON.stringify({
            request: "login",
            playerName: window.playerName
        }))
    }
    ws.onmessage = (evt) => { serverInputHandler(evt) }

    setTimeout(() => {
        if (!window.connectionSuccessful) {
            alert("Connection failed")
            document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=customConnectionSettings()>Connect to a custom server</button></div></div></div>"
        }
    }, 10000);
}

function customConnectionSettings() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Custom server IP</h1><br><input class=textbox placeholder=IP value=localhost:7000 id=ipCache><br><button class=login-btn onclick=connectCustom()>Connect</button></div>"
}

function readyCheck() {
    /*if (document.getElementById("readyCheckButton").innerHTML == "Ready") {
        document.getElementById("readyCheckButton").innerHTML = "Not Ready"
    } else {
        document.getElementById("readyCheckButton").innerHTML = "Ready"
    }*/
    ws.send(JSON.stringify({
        request: "readyCheck",
        name: window.gameName,
        player: window.player
    }))
}

function createGameField() {
    document.getElementById("content").innerHTML = "<div><span class=text id=money>Money: 0</span><span class=text id=health>Health: 100</span></div><canvas id=canv></canvas><div id=soldierSpawnAbilities><div class=inline onclick=yellowSoldierSpawn()><img src=yellowSoldierSpawn.png></div><div class=inline onclick=blueSoldierSpawn()><img src=blueSoldierSpawn.png></div>"
}

function yellowSoldierSpawn() {
    ws.send(JSON.stringify({
        request: "yellowSoldierSpawn",
        name: window.gameName,
        player: window.player
    }))
}

function blueSoldierSpawn() {
    ws.send(JSON.stringify({
        request: "blueSoldierSpawn",
        name: window.gameName,
        player: window.player
    }))
}

function game() {
    ws.send(JSON.stringify({
        request: "game",
        name: window.gameName,
        player: window.player,
        left: window.left,
        up: window.up,
        right: window.right,
        down: window.down,
        ctrl: window.ctrl,
        shift: window.shift,
        space: window.space
    }
    ))

    document.getElementById("money").innerHTML = player == 1 ? "Money: " + Math.floor(gameObj.player1.money) : "Money: " + Math.floor(gameObj.player2.money)
    document.getElementById("health").innerHTML = player == 1 ? "Health: " + gameObj.player1.health : "Health: " + gameObj.player2.health
    draw()
}

function draw() {

    if (window.player == 1) {
        /*
        ---PLAYER DRAWING - P1---
        */
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 700, 700);
        ctx.beginPath();
        ctx.moveTo(gameObj.player1.xpos + 30, canv.height);
        ctx.lineTo(gameObj.player1.xpos, canv.height - 50);
        ctx.lineTo(gameObj.player1.xpos - 30, canv.height);
        ctx.lineTo(gameObj.player1.xpos + 30, canv.height);
        ctx.closePath();
        ctx.fillStyle = "#4caf50";
        ctx.fill();

        ctx.beginPath()
        ctx.moveTo(gameObj.player2.xpos - 30, 0)
        ctx.lineTo(gameObj.player2.xpos, 50)
        ctx.lineTo(gameObj.player2.xpos + 30, 0)
        ctx.lineTo(gameObj.player2.xpos - 30, 0)
        ctx.fill()
        /*
        ---SHOT DRAWING - P1---
        */
        for (index of gameObj.player1.shots) {
            ctx.fillStyle = "red";
            ctx.fillRect(index.xpos - index.width / 2, index.ypos - 10, index.width, 20);
        }
        for (index of gameObj.player2.shots) {
            ctx.fillStyle = "red";
            ctx.fillRect(index.xpos - index.width / 2, 700 - index.ypos + 10, index.width, 20);
        }
        /*
        ---SOLDIER DRAWING P1---
        */
        for (index of gameObj.player1.soldiers) {
            switch (index.type) {
                case "yellow":
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(index.xpos - index.width / 2, index.ypos - index.height / 2, index.width, index.height);
                    break
                case "blue":
                    ctx.fillStyle = "blue";
                    ctx.fillRect(index.xpos - index.width / 2, index.ypos - index.height / 2, index.width, index.height);
                    break
            }
        }
        for (index of gameObj.player2.soldiers) {
            switch (index.type) {
                case "yellow":
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(index.xpos - index.width / 2, 700 - index.ypos - index.height / 2, index.width, index.height);
                    break
                case "blue":
                    ctx.fillStyle = "blue";
                    ctx.fillRect(index.xpos - index.width / 2, 700 - index.ypos - index.height / 2, index.width, index.height);
                    break
            }
        }
        /*
        ---SCOPE DRAWING P1---
        */
        if (gameObj.player1.scope) {
            ctx.strokeStyle = "#fcba03";
            ctx.beginPath();
            ctx.moveTo(gameObj.player1.xpos, 670)
            ctx.lineTo(gameObj.player1.xpos, 0)
            ctx.stroke();
        }
        if (gameObj.player2.scope) {
            ctx.strokeStyle = "#fcba03";
            ctx.beginPath();
            ctx.moveTo(gameObj.player2.xpos, 700)
            ctx.lineTo(gameObj.player2.xpos, 30)
            ctx.stroke();
        }
    } else {
        /*
        ---PLAYER DRAWING - P2---
        */
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 700, 700);
        ctx.beginPath();
        ctx.moveTo(gameObj.player2.xpos + 30, canv.height);
        ctx.lineTo(gameObj.player2.xpos, canv.height - 50);
        ctx.lineTo(gameObj.player2.xpos - 30, canv.height);
        ctx.lineTo(gameObj.player2.xpos + 30, canv.height);
        ctx.closePath();
        ctx.fillStyle = "#4caf50";
        ctx.fill();

        ctx.beginPath()
        ctx.moveTo(gameObj.player1.xpos - 30, 0)
        ctx.lineTo(gameObj.player1.xpos, 50)
        ctx.lineTo(gameObj.player1.xpos + 30, 0)
        ctx.lineTo(gameObj.player1.xpos - 30, 0)
        ctx.fill()
        /*
        ---SHOT DRAWING - P2---
        */
        for (index of gameObj.player2.shots) {
            ctx.fillStyle = "red";
            ctx.fillRect(index.xpos - gameObj.player2.bulletWidth / 2, index.ypos, gameObj.player2.bulletWidth, 20);
        }
        for (index of gameObj.player1.shots) {
            ctx.fillStyle = "red";
            ctx.fillRect(index.xpos - gameObj.player1.bulletWidth / 2, 700 - index.ypos, gameObj.player1.bulletWidth, 20);
        }
        /*
        ---SOLDIER DRAWING - P2---
        */
        for (index of gameObj.player2.soldiers) {
            switch (index.type) {
                case "yellow":
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(index.xpos - index.width / 2, index.ypos - index.height / 2, index.width, index.height);
                    break
                case "blue":
                    ctx.fillStyle = "blue";
                    ctx.fillRect(index.xpos - index.width / 2, index.ypos - index.height / 2, index.width, index.height);
                    break
            }
        }
        for (index of gameObj.player1.soldiers) {
            switch (index.type) {
                case "yellow":
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(index.xpos - index.width / 2, 700 - index.ypos - index.height / 2, index.width, index.height);
                    break
                case "blue":
                    ctx.fillStyle = "blue";
                    ctx.fillRect(index.xpos - index.width / 2, 700 - index.ypos - index.height / 2, index.width, index.height);
                    break
            }
        }
        /*
        ---SCOPE DRAWING P2---
        */
        if (gameObj.player2.scope) {
            ctx.strokeStyle = "#fcba03";
            ctx.beginPath();
            ctx.moveTo(gameObj.player1.xpos, 700)
            ctx.lineTo(gameObj.player1.xpos, 30)
            ctx.stroke();
        }
        if (gameObj.player1.scope) {
            ctx.strokeStyle = "#fcba03";
            ctx.beginPath();
            ctx.moveTo(gameObj.player2.xpos, 670)
            ctx.lineTo(gameObj.player2.xpos, 0)
            ctx.stroke();
        }
    }
}