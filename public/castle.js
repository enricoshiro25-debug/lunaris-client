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

// ===== GRIGLIA (LOGICA INVARIATA) =====
const TILE = 40;          // dimensione logica
const COLS = 16;
const ROWS = 12;

// ===== ISOMETRIA (RENDER) =====
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const player = document.getElementById("player");

// posizione logica (IDENTICA A PRIMA)
let gridX = 7;
let gridY = 6;

// origine isometrica (centro stanza)
function getOrigin() {
  return {
    x: room.clientWidth / 2,
    y: 60
  };
}

// logica → schermo (SOLO RENDER)
function isoToScreen(x, y) {
  const o = getOrigin();
  return {
    x: (x - y) * (ISO_W / 2) + o.x,
    y: (x + y) * (ISO_H / 2) + o.y
  };
}

// posizionamento PG (piedi sul tile)
function updatePlayer() {
  const pos = isoToScreen(gridX, gridY);
  player.style.left = (pos.x - player.offsetWidth / 2) + "px";
  player.style.top = (pos.y - player.offsetHeight) + "px";
}

// CLICK — USA ANCORA LA LOGICA TOP-DOWN
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // convertiamo il click come se fosse top-down
  const relX = mx / rect.width;
  const relY = my / rect.height;

  gridX = Math.floor(relX * COLS);
  gridY = Math.floor(relY * ROWS);

  updatePlayer();
});

updatePlayer();
