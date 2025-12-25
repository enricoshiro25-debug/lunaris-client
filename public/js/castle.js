const map = document.getElementById("map");

/* ===== COSTANTI ===== */
const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_X = window.innerWidth / 2;
const ORIGIN_Y = 200;

/* ===== ISO ===== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

/* ===== GRIGLIA ===== */
for (let x = 0; x < 7; x++) {
  for (let y = 0; y < 7; y++) {
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

/* ===== CLICK MOVE (TELEPORT PER ORA, STABILE) ===== */
map.addEventListener("click", (e) => {
  const mx = e.clientX;
  const my = e.clientY;

  const dx = mx - ORIGIN_X;
  const dy = my - ORIGIN_Y;

  const tx = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const ty = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

  if (tx < 0 || ty < 0 || tx > 6 || ty > 6) return;

  const ddx = tx - player.x;
  const ddy = ty - player.y;

  if (Math.abs(ddx) > Math.abs(ddy)) {
    player.dir = ddx > 0 ? "e" : "w";
  } else {
    player.dir = ddy > 0 ? "s" : "n";
  }

  player.x = tx;
  player.y = ty;

  updateAvatar();
  drawPlayer();
});
