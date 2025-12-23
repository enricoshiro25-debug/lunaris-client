console.log("CASTLE JS 11.5 CARICATO");

// =========================
// CONFIG
// =========================
const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.12;

const MAP_COLS = 10;
const MAP_ROWS = 10;

// =========================
// PLAYER
// =========================
const player = {
  tileX: 4,
  tileY: 4,
  targetX: 4,
  targetY: 4,
  screenX: 0,
  screenY: 0,
  direction: "s",
  robe: "robe1"
};

const game = document.getElementById("game");
const playerEl = document.getElementById("player");
const sprite = document.getElementById("playerSprite");

// =========================
// ISO → SCHERMO
// =========================
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + window.innerWidth / 2,
    y: (x + y) * (TILE_H / 2) + 150
  };
}

// =========================
// AVATAR
// =========================
function updateAvatar() {
  sprite.src = `images/avatars/robe/${player.direction}/${player.robe}.png`;
}

// =========================
// POSIZIONE
// =========================
function updatePosition() {
  playerEl.style.left = player.screenX + "px";
  playerEl.style.top = player.screenY + "px";
}

// =========================
// GRIGLIA DEBUG
// =========================
function drawGrid() {
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const tile = document.createElement("div");
      const pos = isoToScreen(x, y);

      tile.style.position = "absolute";
      tile.style.left = pos.x + "px";
      tile.style.top = pos.y + "px";
      tile.style.width = TILE_W + "px";
      tile.style.height = TILE_H + "px";
      tile.style.transform = "translate(-50%, -50%) rotate(45deg) skewY(-26deg)";
      tile.style.border = "1px solid rgba(255,255,255,0.15)";
      tile.style.pointerEvents = "none";

      game.appendChild(tile);
    }
  }
}

// =========================
// INIT
// =========================
drawGrid();

const start = isoToScreen(player.tileX, player.tileY);
player.screenX = start.x;
player.screenY = start.y;

updateAvatar();
updatePosition();

// =========================
// CLICK
// =========================
document.addEventListener("click", e => {
  const dx = e.clientX - window.innerWidth / 2;
  const dy = e.clientY - 150;

  const tx = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const ty = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

  if (tx < 0 || ty < 0 || tx >= MAP_COLS || ty >= MAP_ROWS) return;

  player.targetX = tx;
  player.targetY = ty;

  const diffX = tx - player.tileX;
  const diffY = ty - player.tileY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    player.direction = diffX > 0 ? "e" : "w";
  } else {
    player.direction = diffY > 0 ? "s" : "n";
  }

  updateAvatar();
});

// =========================
// GAME LOOP
// =========================
function gameLoop() {
  const target = isoToScreen(player.targetX, player.targetY);

  const dx = target.x - player.screenX;
  const dy = target.y - player.screenY;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    player.tileX = player.targetX;
    player.tileY = player.targetY;
    player.screenX = target.x;
    player.screenY = target.y;
  } else {
    player.screenX += dx * MOVE_SPEED;
    player.screenY += dy * MOVE_SPEED;
  }

  updatePosition();
  requestAnimationFrame(gameLoop);
}

gameLoop();
