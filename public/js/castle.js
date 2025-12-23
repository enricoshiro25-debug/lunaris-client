const map = document.getElementById("map");

const TILE_W = 64;
const TILE_H = 32;

const MAP_W = 10;
const MAP_H = 10;

// ---------- ISO UTILS ----------
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + 1000,
    y: (x + y) * (TILE_H / 2) + 300
  };
}

// ---------- GRID ----------
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

// ---------- AVATAR ----------
let player = {
  x: 4,
  y: 4,
  dir: "s"
};

const avatar = document.createElement("img");
avatar.className = "avatar";
map.appendChild(avatar);

function updateAvatar() {
  avatar.src = `images/avatars/robe/${player.dir}/robe1.png`;
  const pos = isoToScreen(player.x, player.y);
  avatar.style.left = pos.x - 32 + "px";
  avatar.style.top = pos.y - 96 + "px";
}

updateAvatar();

// ---------- MOVEMENT ----------
map.addEventListener("click", e => {
  const rect = map.getBoundingClientRect();
  const mx = e.clientX - rect.left - 1000;
  const my = e.clientY - rect.top - 300;

  const tx = Math.round((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const ty = Math.round((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  const dx = tx - player.x;
  const dy = ty - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }

  player.x = Math.max(0, Math.min(MAP_W - 1, tx));
  player.y = Math.max(0, Math.min(MAP_H - 1, ty));

  updateAvatar();
});

// ---------- FURNI ----------
const FURNI_SCALES = {
  bookshelf: 0.45,
  table: 0.38,
  chest: 0.34
};

function addFurni(type, x, y, img) {
  const f = document.createElement("img");
  f.className = "furni";
  f.src = img;

  const pos = isoToScreen(x, y);
  f.style.left = pos.x + "px";
  f.style.top = pos.y + "px";
  f.style.transform = `scale(${FURNI_SCALES[type]})`;

  map.appendChild(f);
}

// POSIZIONI DEFINITIVE
addFurni("bookshelf", 2, 4, "images/furni/bookshelf.png");
addFurni("table",     4, 3, "images/furni/table.png");
addFurni("chest",     3, 5, "images/furni/chest.png");
