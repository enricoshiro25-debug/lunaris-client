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

// ===== MAPPA ISOMETRICA REALE =====
const TILE_W = 64;
const TILE_H = 32;
const GRID_W = 10;
const GRID_H = 10;

const room = document.getElementById("room");
const player = document.getElementById("player");

const ORIGIN_X = room.clientWidth / 2;
const ORIGIN_Y = 40;

let gridX = 4;
let gridY = 4;

// crea le tile vere
for (let y = 0; y < GRID_H; y++) {
  for (let x = 0; x < GRID_W; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    const screenX = (x - y) * (TILE_W / 2) + ORIGIN_X;
    const screenY = (x + y) * (TILE_H / 2) + ORIGIN_Y;

    tile.style.left = screenX - TILE_W / 2 + "px";
    tile.style.top = screenY - TILE_H / 2 + "px";

    tile.dataset.x = x;
    tile.dataset.y = y;

    tile.addEventListener("click", () => {
      gridX = x;
      gridY = y;
      updatePlayer();
    });

    room.appendChild(tile);
  }
}

function updatePlayer() {
  const x = (gridX - gridY) * (TILE_W / 2) + ORIGIN_X;
  const y = (gridX + gridY) * (TILE_H / 2) + ORIGIN_Y;

  // ANCORAGGIO AI PIEDI
  player.style.left = (x - player.offsetWidth / 2) + "px";
  player.style.top = (y - player.offsetHeight) + "px";
}

updatePlayer();
