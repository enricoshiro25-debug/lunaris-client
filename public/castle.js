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

// ===== ISOMETRIA =====
const TILE_W = 64;
const TILE_H = 32;

const room = document.getElementById("room");
const player = document.getElementById("player");

// posizione in griglia isometrica
let gridX = 4;
let gridY = 4;

// conversione griglia → schermo
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + room.clientWidth / 2,
    y: (x + y) * (TILE_H / 2)
  };
}

function updatePlayer() {
  const pos = isoToScreen(gridX, gridY);
  player.style.left = pos.x - 40 + "px";
  player.style.top = pos.y - 90 + "px";
}

// click per muovere
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left - room.clientWidth / 2;
  const my = e.clientY - rect.top;

  const x = Math.floor((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const y = Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  // limiti stanza
  gridX = Math.max(0, Math.min(9, x));
  gridY = Math.max(0, Math.min(9, y));

  updatePlayer();
});

// iniziale
updatePlayer();

