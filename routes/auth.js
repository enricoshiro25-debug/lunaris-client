// Questo è un esempio, non obbligatorio con il server attuale
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname,"../data/players.json");

function loadPlayers() {
  if(fs.existsSync(dataFile)) return JSON.parse(fs.readFileSync(dataFile));
  else return {};
}

function savePlayers(players) {
  fs.writeFileSync(dataFile, JSON.stringify(players, null,2));
}

router.post("/register",(req,res)=>{
  const {username,password} = req.body;
  let players = loadPlayers();
  if(players[username]) return res.status(400).send("Username già esistente");
  players[username] = {password, position:{x:4,y:4}, inventory:[], spells:[]};
  savePlayers(players);
  res.send("Registrato!");
});

router.post("/login",(req,res)=>{
  const {username,password} = req.body;
  let players = loadPlayers();
  if(players[username] && players[username].password===password) return res.send(players[username]);
  else return res.status(400).send("Dati errati");
});

module.exports = router;
