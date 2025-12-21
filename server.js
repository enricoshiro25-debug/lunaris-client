const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

const dataFile = path.join(__dirname, "data/players.json");

// Funzioni di lettura/salvataggio
function loadPlayers() {
  if(fs.existsSync(dataFile)) return JSON.parse(fs.readFileSync(dataFile));
  else return {};
}

function savePlayers(players) {
  fs.writeFileSync(dataFile, JSON.stringify(players, null, 2));
}

// Registrazione
app.post("/register", (req,res)=>{
  const {username,password} = req.body;
  let players = loadPlayers();
  if(players[username]) return res.status(400).send("Username già esistente");
  players[username] = {password, position:{x:4,y:4}, inventory:[], spells:[]};
  savePlayers(players);
  res.send("Registrato!");
});

// Login
app.post("/login", (req,res)=>{
  const {username,password} = req.body;
  let players = loadPlayers();
  if(players[username] && players[username].password===password) return res.send(players[username]);
  else return res.status(400).send("Dati errati");
});

// Socket.io multiplayer
io.on("connection",(socket)=>{
  console.log("Giocatore connesso");

  socket.on("move", data=>{
    io.emit("updatePosition", data);
  });

  socket.on("chat", msg=>{
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", ()=>{
    console.log("Giocatore disconnesso");
  });
});

http.listen(3000, ()=>console.log("Server attivo su http://localhost:3000"));
app.post("/saveAvatar",(req,res)=>{
  const {username, avatar} = req.body;
  let players = loadPlayers();
  if(players[username]){
    players[username].avatar = avatar;
    savePlayers(players);
    return res.send("Avatar salvato!");
  } else return res.status(400).send("Utente non trovato");
});

