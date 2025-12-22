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

let gridX = 4;
let gridY = 4;

function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + room.clientWidth / 2,
    y: (x + y) * (TILE_H / 2)
  };
}

function screenToIso(mx, my) {
  const cx = mx - room.clientWidth / 2;
  const cy = my;

  const isoX = (cy / (TILE_H / 2) + cx / (TILE_W / 2)) / 2;
  const isoY = (cy / (TILE_H / 2) - cx / (TILE_W / 2)) / 2;

  return {
    x: Math.floor(isoX),
    y: Math.floor(isoY)
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updatePlayer() {
  const pos = isoToScreen(gridX, gridY);
  player.style.left = pos.x - 40 + "px";
  player.style.top = pos.y - 90 + "px";
}

// CLICK CORRETTO SU TUTTA LA CELLA
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const iso = screenToIso(mx, my);

  gridX = clamp(iso.x, 0, 9);
  gridY = clamp(iso.y, 0, 9);

  updatePlayer();
});

updatePlayer();
