const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ===== AVATAR =====
const avatar = JSON.parse(localStorage.getItem("avatar_" + username)) || {
  face: 0,
  robe: 0
};

const faces = ["face1.png","face2.png","face3.png"];
const robes = ["robe1.png","robe2.png","robe3.png"];

document.getElementById("face").src =
  "/images/avatars/face/" + faces[avatar.face];

document.getElementById("robe").src =
  "/images/avatars/robe/" + robes[avatar.robe];

// ===== GRIGLIA =====
const TILE = 40;
const COLS = 16;
const ROWS = 12;

const room = document.getElementById("room");
const player = document.getElementById("player");

// posizione iniziale
let gridX = 7;
let gridY = 6;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updatePlayerPosition() {
  player.style.left = gridX * TILE + "px";
  player.style.top = gridY * TILE - 60 + "px";
}

// click su stanza
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let newX = Math.floor(x / TILE);
  let newY = Math.floor(y / TILE);

  // BLOCCO AI CONFINI
  gridX = clamp(newX, 0, COLS - 1);
  gridY = clamp(newY, 0, ROWS - 1);

  updatePlayerPosition();
});

updatePlayerPosition();
