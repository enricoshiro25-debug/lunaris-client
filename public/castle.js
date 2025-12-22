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

// ===== ISOMETRIA MATEMATICA =====
const TILE_W = 64;
const TILE_H = 32;
const GRID_W = 10;
const GRID_H = 10;

const room = document.getElementById("room");
const player = document.getElementById("player");

// origine isometrica (CENTRO MAPPA)
function getOrigin() {
  return {
    x: room.clientWidth / 2,
    y: 60
  };
}

let gridX = 4;
let gridY = 4;

// da griglia → schermo
function isoToScreen(x, y) {
  const o = getOrigin();
  return {
    x: (x - y) * (TILE_W / 2) + o.x,
    y: (x + y) * (TILE_H / 2) + o.y
  };
}

// da schermo → griglia (FORMULA CORRETTA)
function screenToIso(mx, my) {
  const o = getOrigin();
  const dx = mx - o.x;
  const dy = my - o.y;

  const isoX = (dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2;
  const isoY = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;

  return {
    x: Math.round(isoX),
    y: Math.round(isoY)
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// POSIZIONAMENTO CORRETTO AI PIEDI
function updatePlayer() {
  const pos = isoToScreen(gridX, gridY);
  player.style.left = (pos.x - player.offsetWidth / 2) + "px";
  player.style.top = (pos.y - player.offsetHeight + TILE_H / 2) + "px";
}

// CLICK
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const iso = screenToIso(mx, my);

  gridX = clamp(iso.x, 0, GRID_W - 1);
  gridY = clamp(iso.y, 0, GRID_H - 1);

  updatePlayer();
});

updatePlayer();
