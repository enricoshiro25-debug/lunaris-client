const map = document.getElementById("map");

/* ===== ISO COSTANTI ===== */
const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_X = 1000;
const ORIGIN_Y = 350;

/* ===== ISO → SCREEN ===== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

/* ===== GRIGLIA ===== */
for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 8; y++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    const p = isoToScreen(x, y);
    tile.style.left = p.x + "px";
    tile.style.top = p.y + "px";
    map.appendChild(tile);
  }
}

/* ===== PLAYER ===== */
const player = {
  x: 4,
  y: 4,
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

  // ⬇️ ANCORAGGIO AI PIEDI (FIX)
  avatar.style.left = (p.x - 32) + "px";
  avatar.style.top  = (p.y - 88) + "px";
}

updateAvatar();
drawPlayer();

/* ===== FURNI ===== */
function addFurni(src, x, y, w, h, footOffset) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "furni";
  img.style.width = w + "px";
  img.style.height = h + "px";

  const p = isoToScreen(x, y);

  // ⬇️ ANCORAGGIO AI PIEDI (FIX)
  img.style.left = (p.x - w / 2) + "px";
  img.style.top  = (p.y - h + footOffset) + "px";

  map.appendChild(img);
}

/* ===== FURNI POSIZIONATI CORRETTAMENTE ===== */
addFurni("/images/furni/bookshelf.png", 3, 3, 120, 200, 20);
addFurni("/images/furni/table.png",     5, 3, 140, 110, 18);
addFurni("/images/furni/chest.png",     4, 4, 120, 80,  12);

/* ===== MOVIMENTO (NO TELEPORT) ===== */
map.addEventListener("click", () => {
  if (player.x < 7) player.x++;
  if (player.y < 7) player.y++;
  drawPlayer();
});
