const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
var startbutton = document.createElement("button")
startbutton.setAttribute("id", "btn")
startbutton.innerText = "START GAME"
startbutton.addEventListener("click", () => { game.startGame() })
var resetbutton = document.createElement("button")
resetbutton.setAttribute("id", "btn")
resetbutton.innerText = "RESET GAME"
resetbutton.addEventListener("click", () => { game.resetGame() })
document.body.append(startbutton);
document.body.append(resetbutton);
function drawbackground() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
class Player {
    constructor(x, y, dir) {
        this.x = x
        this.y = y
        this.lasers = []
        this.dir = dir
        this.health = 100;
        this.Score = 0;
        this.ScorePlayer1 = 0;
        this.ScorePlayer2 = 0;
    }
    moveleft() {
        this.x -= 8;
        this.x <= 2 ? this.x = 2 : this.x = this.x
    }
    moveright() {
        this.x += 8;
        this.x >= canvas.width - 32 ? this.x = canvas.width - 32 : this.x = this.x
    }
    draw() {
        context.fillStyle = "#fff"
        context.fillRect(this.x, this.y, 30, 30)
    }
    firelaser() {
        let laser = { x: this.x + 12.5, y: this.dir == "down" ? 32 : canvas.height - 32, w: 5, h: 10 }
        this.lasers.push(laser)
        context.fillRect(laser.x, laser.y, laser.w, laser.h);
    }
    updateLaser(player) {
        for (var l of this.lasers) {
            if (this.dir == "down") {
                l.y += 4
                if (
                    l.y >= player.y
                    &&
                    (
                        (l.x <= player.x + 30 && l.x > player.x)
                        ||
                        (l.x + 5 > player.x && l.x + 5 <= player.x + 30)
                    )
                ) {
                    player.health -= Math.floor(Math.random() * 5)
                    l.y = 1000
                    document.getElementById("Player2").innerHTML = "Player 2 <br>Score = " + player.Score + "<br>Health = " + player.health
                }
            }
            else {
                l.y -= 4
                if (
                    l.y <= player.y + 30
                    &&
                    (
                        (l.x <= player.x + 30 && l.x > player.x)
                        ||
                        (l.x + 5 > player.x && l.x + 5 <= player.x + 30)
                    )
                ) {
                    player.health -= Math.floor(Math.random() * 5)
                    l.y = -1000
                    document.getElementById("Player1").innerHTML = "Player 1 <br>Score = " + player.Score + "<br>Health = " + player.health
                }
            }
            context.fillRect(l.x, l.y, l.w, l.h)
        }
        this.lasers = this.lasers.filter(l =>
            this.dir == "down" ? l.y <= canvas.height : l.y >= 0
        )
    }
}
class Game {
    constructor() {
        this.intervalID;
        this.Rounds = 0
        this.Player1 = new Player(5, 2, "down")
        this.Player2 = new Player(5, canvas.height - 32, "up")
    }
    startGame() {
        if (this.gamerunning) {
            return alert("Game is already running !")
        }
        this.Rounds++
        var Gametext = document.getElementById("Gametext")
        if (this.Rounds <= 3) {
            Gametext.innerText = "Round " + this.Rounds
        }
        this.gamerunning = true;
        attachevent(this.Player1, this.Player2)
        this.Player2.health = 100
        this.Player1.health = 100
        document.getElementById("Player1").innerHTML = "Player 1 <br>Score = " + this.Player1.Score + "<br>Health = " + this.Player1.health
        document.getElementById("Player2").innerHTML = "Player 2 <br>Score = " + this.Player2.Score + "<br>Health = " + this.Player2.health
        this.intervalID = setInterval(() => {
            drawbackground()
            this.Player1.draw()
            this.Player2.draw()
            this.checkGame()
        }, 30)
        this.gameid = setInterval(() => {
            this.Player1.updateLaser(this.Player2)
            this.Player2.updateLaser(this.Player1)
        }, 20)
    }
    checkGame() {
        var Gametext = document.getElementById("Gametext")
        if (this.Player1.health <= 0) {
            this.Player1.health = 0
            Gametext.innerText = "Player 2 HAS WON THIS ROUND !"
            this.Player2.Score += 1
            document.getElementById("Player2").innerHTML = "Player 2 <br>Score = " + this.Player2.Score + "<br>Health = " + this.Player2.health
            this.endgame()
        }
        if (this.Player2.health <= 0) {
            this.Player2.health = 0
            Gametext.innerText = "Player 1 HAS WON ROUND !"
            this.Player1.Score += 1
            document.getElementById("Player1").innerHTML = "Player 1 <br> Score = " + this.Player1.Score + "<br>Health = " + this.Player1.health
            this.endgame()
        }
    }
    endgame() {
        clearInterval(this.intervalID)
        clearInterval(this.gameid)
        document.removeEventListener("keydown", events)
        this.gamerunning = false;
        this.Player1.lasers = []
        this.Player2.lasers = []
        if (this.Player2.Score == 3) {
            Gametext.innerText = "Player 2 HAS WON THE TOURNAMENT !"
        }
        if (this.Player1.Score == 3) {
            Gametext.innerText = "Player 1 HAS WON THE TOURNAMENT !"
        }
    }
    resetGame() {
        this.Rounds = 0
        this.gamerunning = false;
        this.Player1.Score = 0
        this.Player2.Score = 0
        document.getElementById("Player1").innerHTML = "Player 1 <br>Score = " + this.Player1.Score
        document.getElementById("Player2").innerHTML = "Player 2 <br>Score = " + this.Player2.Score
    }
}
const game = new Game()
var events = (e) => {
    switch (e.keyCode) {
        case 38: game.Player1.firelaser(); break;
        case 87: game.Player2.firelaser(); break;
        case 37: game.Player1.moveleft(); break;
        case 39: game.Player1.moveright(); break;
        case 65: game.Player2.moveleft(); break;
        case 68: game.Player2.moveright(); break;
        default:
            break;
    }
}
const attachevent = () => {
    document.addEventListener("keydown", events
    )
}
