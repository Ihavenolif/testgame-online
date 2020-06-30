ip = ""
playerName = ""
gameName = ""
password = ""
player = null
gamesList = null
gameObj = {}
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
            row.insertCell(ii++).innerHTML = gamesList[x]["password"]
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
    xhttp.open("POST", ip, true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        getGamesList: true
    }))
}

function createGame(gameName, password) {
    // REPLACING " " WITH "-"
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
    xhttp.open("POST", ip, true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        createGame: true,
        gameName: gameName,
        password: password,
        playerName: playerName
    }))
    gameLobby(playerName, "Waiting for another player", 1)
    window.player = 1
    window.gameName = gameName
}

function lobbySelection() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Available games</h1><br><table id=table><tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr></table><button class=login-btn onclick=refresh()>Refresh</button><button class=login-btn onclick=createGameMenu()>Create Game</button></div>"
    refresh()
}

function gameLobby(name1, name2, player) {
    if (player == 1) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Not Ready</button></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><img id=readyImg class=readyImg src=notReady.png></div><div></div>"
    } else if (player == 2) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><br><img id=readyImg class=readyImg src=notReady.png></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Not Ready</button></div><div></div>"
    }

    checkGameStatus = setInterval(() => {
        xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                result = JSON.parse(this.responseText)
                if(player == 1){
                    if(!result.player2 == ""){
                        document.getElementById("name2").innerHTML = result.player2
                    }
                    if(result.player2ready){
                        document.getElementById("readyImg").src = "ready.png"
                    } else{
                        document.getElementById("readyImg").src = "notReady.png"
                    }
                }else{
                    if(result.player1ready){
                        document.getElementById("readyImg").src = "ready.png"
                    }else{
                        document.getElementById("readyImg").src = "notReady.png"
                    }
                }
                if(result.gameStarted){
                    clearInterval(checkGameStatus)
                    createGameField()
                    engineLoad()
                    clearInterval(checkGameStatus)
                    checkGameStatus = setInterval(game, 1000/60);
                }
            }
        }
        xhttp.open("POST", ip, true)
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhttp.send(JSON.stringify({
            checkGameStatus: true,
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
        xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                result = JSON.parse(this.responseText)
                console.log(result)
                gameLobby(result.player1, playerName, 2)
                window.gameName = gameId.name
                window.player = 2
            }
        }
        xhttp.open("POST", ip, true)
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        if(gameId.password == "no"){
            xhttp.send(JSON.stringify({
                joinGame: true,
                name: gameId.name,
                password: "",
                playerName: playerName
            }))
        } else{
            xhttp.send(JSON.stringify({
                joinGame: true,
                name: gameId.name,
                password: prompt("Enter game password"),
                playerName: playerName
            }))
        }
    } else {
        alert("You cannot connect to yourself.")
    }
}

function connectOfficial(){
    connectionSuccessful = false
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Connecting...</h1></div>"
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("content").innerHTML = "<div class=login-box><h1>TESTGAME ONLINE</h1><input class=textbox placeholder=Nickname id=nick><br><button class=login-btn onclick=login()>Login</button></div>"
            connectionSuccessful = true
            ip = "https://testgame-server.herokuapp.com/"
        }
    }
    xhttp.open("POST", "https://testgame-server.herokuapp.com/", true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        checkConnection: true
    }))

    setTimeout(() => {
        if(!connectionSuccessful){
            alert("Connection failed")
            document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=connectCustom()>Connect to a custom server</button></div></div></div>"
        }
    }, 10000);
}

function connectCustom(){
    if(document.getElementById("ipCache").value.startsWith("localhost") || document.getElementById("ipCache").value.startsWith("192")){ //when connecting using a local network (not using HTTPS protocol)
        cacheIP = "http://" + document.getElementById("ipCache").value
    } else{
        cacheIP = "https://" + document.getElementById("ipCache").value 
    }
    connectionSuccessful = false
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Connecting...</h1></div>"
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            document.getElementById("content").innerHTML = "<div class=login-box><h1>TESTGAME ONLINE</h1><input class=textbox placeholder=Nickname id=nick><br><button class=login-btn onclick=login()>Login</button></div>"
            connectionSuccessful = true
            ip = cacheIP
        }
    }
    xhttp.open("POST", cacheIP, true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        checkConnection: true
    }))

    setTimeout(() => {
        if(!connectionSuccessful){
            alert("Connection failed")
            document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=customConnectionSettings()>Connect to a custom server</button></div></div></div>"
        }
    }, 10000);
}

function customConnectionSettings(){
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Custom server IP</h1><br><input class=textbox placeholder=IP value=localhost:7000 id=ipCache><br><button class=login-btn onclick=connectCustom()>Connect</button></div>"
}

function readyCheck(){
    if(document.getElementById("readyCheckButton").innerHTML == "Ready"){
        document.getElementById("readyCheckButton").innerHTML = "Not Ready"
    } else{
        document.getElementById("readyCheckButton").innerHTML = "Ready"
    }
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(player == 1){
                if(result.player2ready){
                    document.getElementById("readyImg").src = "ready.png"
                } else{
                    document.getElementById("readyImg").src = "notReady.png"
                }
            }else{
                if(result.player1ready){
                    document.getElementById("readyImg").src = "ready.png"
                }else{
                    document.getElementById("readyImg").src = "notReady.png"
                }
            }
        }
    }
    xhttp.open("POST", ip, true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        readyCheck: true,
        name: window.gameName,
        player: window.player
    }))
}

function createGameField(){
    document.getElementById("content").innerHTML = "<canvas id=canv></canvas>"
}

function game(){
    console.log(window.left)
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            gameObj = JSON.parse(this.responseText)
        }
    }
    xhttp.open("POST", ip, true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhttp.send(JSON.stringify({
        game: true,
        name: window.gameName,
        player: window.player,
        left: window.left,
        up: window.up,
        right: window.right,
        down: window.down,
        ctrl: window.ctrl,
        shift: window.shift,
        space: window.space
    }))

    draw()
}

function draw(){
    if(window.player == 1){
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
    }else{
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
    }
    
}