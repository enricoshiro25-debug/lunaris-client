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

// ===== LOGICA GRIGLIA (SOLIDA) =====
const COLS = 16;
const ROWS = 12;

// ===== ISOMETRIA (RENDER) =====
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const player = document.getElementById("player");

// posizione logica
let gridX = 7;
let gridY = 6;

// origine isometrica
function getOrigin() {
  return {
    x: room.clientWidth / 2,
    y: 80
  };
}

// logica → schermo
function isoToScreen(x, y) {
  const o = getOrigin();
  return {
    x: (x - y) * (ISO_W / 2) + o.x,
    y: (x + y) * (ISO_H / 2) + o.y
  };
}

// schermo → logica (INVERSA CORRETTA)
function screenToGrid(mx, my) {
  const o = getOrigin();
  const dx = mx - o.x;
  const dy = my - o.y;

  const gx = (dx / (ISO_W / 2) + dy / (ISO_H / 2)) / 2;
  const gy = (dy / (ISO_H / 2) - dx / (ISO_W / 2)) / 2;

  return {
    x: Math.floor(gx),
    y: Math.floor(gy)
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// posizionamento PG (piedi)
function updatePlayer() {
  const pos = isoToScreen(gridX, gridY);

  const FOOT_OFFSET = 10; // 👈 REGOLAZIONE FINE (8–14)

  player.style.left =
    (pos.x - player.offsetWidth / 2) + "px";

  player.style.top =
    (pos.y - player.offsetHeight + FOOT_OFFSET) + "px";
}

// CLICK CORRETTO
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const g = screenToGrid(mx, my);

  gridX = clamp(g.x, 0, COLS - 1);
  gridY = clamp(g.y, 0, ROWS - 1);

  updatePlayer();
});

updatePlayer();
