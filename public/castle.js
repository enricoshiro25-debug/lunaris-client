// ================= LOGIN CHECK =================
const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ================= AVATAR =================
const avatar = JSON.parse(localStorage.getItem("avatar_" + username)) || {
  face: 0,
  robe: 0
};

const faces = ["face1.png", "face2.png", "face3.png"];
const robes = ["robe1.png", "robe2.png", "robe3.png"];

const faceImg = document.getElementById("face");
const robeImg = document.getElementById("robe");

faceImg.src = "/images/avatars/face/" + faces[avatar.face];
robeImg.src = "/images/avatars/robe/" + robes[avatar.robe];

// ================= MAPPA LOGICA =================
const COLS = 16;
const ROWS = 12;

// ================= ISOMETRIA =================
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const floor = document.getElementById("floor");
const player = document.getElementById("player");

// ================= STATO PG =================
let gridX = 7;
let gridY = 6;

let lastX = gridX;
let lastY = gridY;
let direction = "front";

let walkInterval = null;
let walkFrame = 0;

// ================= COLLISION MAP =================
const blocked = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(false)
);

// ================= PAVIMENTO =================
floor.innerHTML = "";

for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    const screenX = (x - y) * (ISO_W / 2);
    const screenY = (x + y) * (ISO_H / 2);

    tile.style.left = screenX + "px";
    tile.style.top = screenY + "px";
    tile.style.zIndex = x + y;

    floor.appendChild(tile);
  }
}

// ================= OGGETTI =================
const furniList = [
  { img: "/images/furni/chest.png", x: 6, y: 7, offsetY: 20 },
  { img: "/images/furni/table.png", x: 9, y: 6, offsetY: 28 },
  { img: "/images/furni/bookshelf.png", x: 4, y: 5, offsetY: 48 }
];

// BLOCCO TILE
furniList.forEach(f => {
  blocked[f.y][f.x] = true;
});

// ================= ISO POSITION =================
function isoPos(x, y) {
  return {
    x: (x - y) * (ISO_W / 2),
    y: (x + y) * (ISO_H / 2)
  };
}

// ================= FURNI RENDER =================
function drawFurni() {
  furniList.forEach(f => {
    const el = document.createElement("img");
    el.src = f.img;
    el.className = "furni";

    const pos = isoPos(f.x, f.y);
    const floorRect = floor.getBoundingClientRect();
    const roomRect = room.getBoundingClientRect();

    el.style.left =
      floorRect.left - roomRect.left + pos.x - 32 + "px";
    el.style.top =
      floorRect.top - roomRect.top + pos.y - f.offsetY + "px";

    el.style.zIndex = f.x + f.y + 5;
    room.appendChild(el);
  });
}

// ================= CAMMINATA =================
function startWalk() {
  if (walkInterval) return;
  walkInterval = setInterval(() => {
    walkFrame = (walkFrame + 1) % 2;
    player.style.transform =
      `scaleX(${direction === "left" ? -1 : 1}) translateY(${walkFrame ? -2 : 0}px)`;
  }, 200);
}

function stopWalk() {
  clearInterval(walkInterval);
  walkInterval = null;
  player.style.transform =
    `scaleX(${direction === "left" ? -1 : 1})`;
}

// ================= UPDATE PLAYER =================
function updatePlayer() {
  if (gridX !== lastX || gridY !== lastY) startWalk();
  else stopWalk();

  if (gridX > lastX) direction = "right";
  else if (gridX < lastX) direction = "left";
  else if (gridY > lastY) direction = "front";
  else if (gridY < lastY) direction = "back";

  lastX = gridX;
  lastY = gridY;

  const pos = isoPos(gridX, gridY);
  const floorRect = floor.getBoundingClientRect();
  const roomRect = room.getBoundingClientRect();

  player.style.left =
    floorRect.left - roomRect.left + pos.x - player.offsetWidth / 2 + "px";
  player.style.top =
    floorRect.top - roomRect.top + pos.y - player.offsetHeight + 16 + "px";

  player.style.zIndex = gridX + gridY + 10;
}

// ================= CLICK CON COLLISIONI =================
floor.addEventListener("click", e => {
  const r = floor.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  const isoX = mx / (ISO_W / 2);
  const isoY = my / (ISO_H / 2);

  const x = Math.floor((isoY + isoX) / 2);
  const y = Math.floor((isoY - isoX) / 2);

  if (
    x >= 0 && x < COLS &&
    y >= 0 && y < ROWS &&
    !blocked[y][x]
  ) {
    gridX = x;
    gridY = y;
    updatePlayer();
  }
});

// ================= INIT =================
drawFurni();
updatePlayer();
