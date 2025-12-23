const map = document.getElementById("map");

/* ===== COSTANTI ISO ===== */
const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_X = window.innerWidth / 2;
const ORIGIN_Y = 200;

/* ===== ISO → SCREEN ===== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

/* ===== DISEGNA GRIGLIA ===== */
for (let x = 0; x < 7; x++) {
  for (let y = 0; y < 7; y++) {
    const t = document.createElement("div");
    t.className = "tile";
    const p = isoToScreen(x, y);
    t.style.left = p.x + "px";
    t.style.top = p.y + "px";
    map.appendChild(t);
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
  avatar.style.top  = (p.y - 96) + "px"; // piedi sulla tile
}

updateAvatar();
drawPlayer();

/* ===== FURNI ===== */
function furni(src, x, y, w, h, foot) {
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

furni("/images/furni/bookshelf.png", 2, 2, 120, 200, 20);
furni("/images/furni/table.png",     4, 2, 140, 110, 18);
furni("/images/furni/chest.png",     3, 3, 120, 80,  12);

/* ===== CLICK MOVE (TEST) ===== */
map.addEventListener("click", () => {
  player.x++;
  player.y++;
  drawPlayer();
});
