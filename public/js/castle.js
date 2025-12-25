const map = document.getElementById("map");

/* ===== COSTANTI ===== */
const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_X = window.innerWidth / 2;
const ORIGIN_Y = 200;
const GRID_SIZE = 7;
const SPEED = 0.06;

/* ===== ISO ===== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

function screenToIso(mx, my) {
  const dx = mx - ORIGIN_X;
  const dy = my - ORIGIN_Y;

  return {
    x: Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2),
    y: Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2)
  };
}

/* ===== GRIGLIA ===== */
for (let x = 0; x < GRID_SIZE; x++) {
  for (let y = 0; y < GRID_SIZE; y++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    const p = isoToScreen(x, y);
    tile.style.left = p.x + "px";
    tile.style.top  = p.y + "px";
    map.appendChild(tile);
  }
}

/* ===== PLAYER ===== */
const player = {
  x: 3,
  y: 3,
  dir: "s"
};

let target = null;
let moving = false;

const avatar = document.createElement("img");
avatar.className = "avatar";
map.appendChild(avatar);

function updateAvatar() {
  avatar.src = `/images/avatars/robe/${player.dir}/robe1.png`;
}

function drawPlayer() {
  const p = isoToScreen(player.x, player.y);
  avatar.style.left = (p.x - 32) + "px";
  avatar.style.top  = (p.y - 96) + "px";
}

updateAvatar();
drawPlayer();

/* ===== FURNI ===== */
function addFurni(src, x, y, w, h, foot) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "furni";
  img.style.width = w + "px";
  img.style.height = h + "px";

  const p = isoToScreen(x, y);
  img.style.left = (p.x - w / 2) + "px";
  img.style.top  = (p.y - h + foot) + "px";

  map.appendChild(img);
}

addFurni("/images/furni/bookshelf.png", 2, 2, 120, 200, 20);
addFurni("/images/furni/table.png",     4, 2, 140, 110, 18);
addFurni("/images/furni/chest.png",     3, 3, 120, 80,  12);

/* ===== CLICK ===== */
map.addEventListener("click", (e) => {
  const pos = screenToIso(e.clientX, e.clientY);

  if (
    pos.x < 0 || pos.y < 0 ||
    pos.x >= GRID_SIZE || pos.y >= GRID_SIZE
  ) return;

  target = { x: pos.x, y: pos.y };

  const dx = target.x - player.x;
  const dy = target.y - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }

  updateAvatar();

  if (!moving) {
    moving = true;
    requestAnimationFrame(movePlayer);
  }
});

/* ===== MOVIMENTO FLUIDO ===== */
function movePlayer() {
  if (!target) {
    moving = false;
    return;
  }

  const dx = target.x - player.x;
  const dy = target.y - player.y;

  if (Math.abs(dx) < SPEED && Math.abs(dy) < SPEED) {
    player.x = target.x;
    player.y = target.y;
    target = null;
    drawPlayer();
    moving = false;
    return;
  }

  player.x += Math.sign(dx) * SPEED;
  player.y += Math.sign(dy) * SPEED;

  drawPlayer();
  requestAnimationFrame(movePlayer);
}
