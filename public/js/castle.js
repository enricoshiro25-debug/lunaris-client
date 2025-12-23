const map = document.getElementById("map");

const TILE_W = 64;
const TILE_H = 32;

const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = 1000;
const ORIGIN_Y = 300;

/* ================= ISO UTILS ================= */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

/* ================= GRID ================= */
for (let x = 0; x < MAP_W; x++) {
  for (let y = 0; y < MAP_H; y++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    const pos = isoToScreen(x, y);
    tile.style.left = pos.x + "px";
    tile.style.top = pos.y + "px";
    map.appendChild(tile);
  }
}

/* ================= PLAYER ================= */
const player = {
  x: 4,
  y: 4,
  dir: "s"
};

const avatar = document.createElement("img");
avatar.className = "avatar";
avatar.style.zIndex = 1000;
map.appendChild(avatar);

function updateAvatar() {
  avatar.src = `images/avatars/robe/${player.dir}/robe1.png`;

  const pos = isoToScreen(player.x, player.y);

  avatar.style.left = pos.x - 32 + "px";
  avatar.style.top = pos.y - 86 + "px"; // OFFSET CORRETTO
  avatar.style.zIndex = 1000 + player.x + player.y;
}

updateAvatar();

/* ================= CLICK MOVE ================= */
map.addEventListener("click", e => {
  const rect = map.getBoundingClientRect();
  const mx = e.clientX - rect.left - ORIGIN_X;
  const my = e.clientY - rect.top - ORIGIN_Y;

  const tx = Math.round((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const ty = Math.round((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  const nx = Math.max(0, Math.min(MAP_W - 1, tx));
  const ny = Math.max(0, Math.min(MAP_H - 1, ty));

  const dx = nx - player.x;
  const dy = ny - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }

  player.x = nx;
  player.y = ny;

  updateAvatar();
});

/* ================= FURNI ================= */
function addFurni(src, x, y, scale = 0.35) {
  const f = document.createElement("img");
  f.src = src;
  f.className = "furni";

  const pos = isoToScreen(x, y);
  f.style.left = pos.x + "px";
  f.style.top = pos.y + "px";
  f.style.transform = `scale(${scale})`;
  f.style.zIndex = 1000 + x + y;

  map.appendChild(f);
}

// POSIZIONI E SCALE FINALI
addFurni("images/furni/bookshelf.png", 2, 4, 0.42);
addFurni("images/furni/table.png",     4, 3, 0.38);
addFurni("images/furni/chest.png",     3, 5, 0.34);
