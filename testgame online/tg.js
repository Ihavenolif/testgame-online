ip = ""
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
}

function lobbySelection() {
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Available games</h1><br><table id=table><tr><td class=gameName>Game name</td><td class=leaderName>Leader name</td><td class=password>Password</td><td class=joinButton></td></tr></table><button class=login-btn onclick=refresh()>Refresh</button><button class=login-btn onclick=createGameMenu()>Create Game</button></div>"
    refresh()
}

function gameLobby(name1, name2, player) {
    if (player == 1) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Ready</button></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><img class=readyImg src=notReady.png></div><div></div>"
    } else if (player == 2) {
        document.getElementById("content").innerHTML = "<div class=login-box><h1>Game lobby</h1><div class=dual><div class=halfFlex><span id=name1>" + name1 + "</span><br><img class=readyImg src=notReady.png></div><div class=halfFlex><span id=name2>" + name2 + "</span><br><button id=readyCheckButton class=login-btn onclick=readyCheck(" + player + ")>Ready</button></div><div></div>"
    }
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
                response = JSON.parse(this.responseText)
                console.log(JSON.parse(this.responseText))
                gameLobby(response.player1, playerName, 2)
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
    if(document.getElementById("ipCache").value.startsWith("localhost") || document.getElementById("ipCache").value.startsWith("192")){
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
            document.getElementById("content").innerHTML = "<div class=login-box><h1>Choose a server</h1><div class=dual><div class=halfflex><button class=chooseOneBtn onclick=connectOfficial()>Connect to official servers</button></div><div class=halfflex><button class=chooseOneBtn onclick=connectCustom()>Connect to a custom server</button></div></div></div>"
        }
    }, 10000);
}

function customConnectionSettings(){
    document.getElementById("content").innerHTML = "<div class=login-box><h1>Custom server IP</h1><br><input class=textbox placeholder=IP id=ipCache><br><button class=login-btn onclick=connectCustom()>Connect</button></div>"
}