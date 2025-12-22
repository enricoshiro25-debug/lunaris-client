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

// ===== ROOM & GRID =====
const TILE = 40;
const room = document.getElementById("room");
const player = document.getElementById("player");

let gridX = 5;
let gridY = 5;

function getGridLimits() {
  return {
    cols: Math.floor(room.clientWidth / TILE),
    rows: Math.floor(room.clientHeight / TILE)
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updatePlayerPosition() {
  player.style.left = gridX * TILE + "px";
  player.style.top = gridY * TILE - 60 + "px";
}

// CLICK SU STANZA
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const { cols, rows } = getGridLimits();

  let newX = Math.floor(x / TILE);
  let newY = Math.floor(y / TILE);

  gridX = clamp(newX, 0, cols - 1);
  gridY = clamp(newY, 0, rows - 1);

  updatePlayerPosition();
});

// AGGIORNA SE CAMBIA DIMENSIONE (fullscreen / resize)
window.addEventListener("resize", updatePlayerPosition);

updatePlayerPosition();
