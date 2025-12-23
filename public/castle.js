// ===== LOGIN =====
const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ===== AVATAR DATA =====
const avatar = {
  face: 0,
  robe: 0
};

const faces = ["face1.png", "face2.png"];
const robes = ["robe1.png", "robe2.png"];

// ===== MAPPA =====
const COLS = 16;
const ROWS = 12;
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const floor = document.getElementById("floor");
const player = document.getElementById("player");

let gridX = 7;
let gridY = 6;
let direction = "s"; // s n e w

// ===== FLOOR =====
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.left = (x - y) * (ISO_W / 2) + "px";
    tile.style.top = (x + y) * (ISO_H / 2) + "px";
    tile.style.zIndex = x + y;
    floor.appendChild(tile);
  }
}

// ===== ISO =====
function isoPos(x, y) {
  return {
    x: (x - y) * (ISO_W / 2),
    y: (x + y) * (ISO_H / 2)
  };
}

// ===== AVATAR =====
function updateAvatar() {
  document.getElementById("face").src =
    `/images/avatars/face/${direction}/${faces[avatar.face]}`;
  document.getElementById("robe").src =
    `/images/avatars/robe/${direction}/${robes[avatar.robe]}`;
}

// ===== PLAYER =====
function updatePlayer() {
  const pos = isoPos(gridX, gridY);
  player.style.left = pos.x + room.clientWidth / 2 - 40 + "px";
  player.style.top = pos.y + 80 - 120 + "px";
  player.style.zIndex = gridX + gridY + 10;
}

// ===== DIRECTION =====
function updateDirection(nx, ny) {
  if (nx > gridX) direction = "e";
  else if (nx < gridX) direction = "w";
  else if (ny > gridY) direction = "s";
  else if (ny < gridY) direction = "n";
}

// ===== CLICK =====
floor.addEventListener("click", e => {
  const r = floor.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  const isoX = mx / (ISO_W / 2);
  const isoY = my / (ISO_H / 2);

  const x = Math.floor((isoY + isoX) / 2);
  const y = Math.floor((isoY - isoX) / 2);

  if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
    updateDirection(x, y);
    gridX = x;
    gridY = y;
    updateAvatar();
    updatePlayer();
  }
});

// ===== INIT =====
updateAvatar();
updatePlayer();
