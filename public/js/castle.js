console.log("CASTLE JS 11.7 CARICATO");

// =========================
// CONFIG
// =========================
const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.12;

const MAP_COLS = 10;
const MAP_ROWS = 10;

// =========================
// MAPPA COLLISIONI
// 0 = libero
// 1 = bloccato
// =========================
const collisionMap = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

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
// POSIZIONE + Z
// =========================
function updatePosition() {
  playerEl.style.left = player.screenX + "px";
  playerEl.style.top = player.screenY + "px";
  playerEl.style.zIndex = player.tileY * 10;
}

// =========================
// INIT
// =========================
const start = isoToScreen(player.tileX, player.tileY);
player.screenX = start.x;
player.screenY = start.y;

updateAvatar();
updatePosition();

// =========================
// CLICK → CON COLLISIONI
// =========================
document.addEventListener("click", e => {
  const dx = e.clientX - window.innerWidth / 2;
  const dy = e.clientY - 150;

  const tx = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const ty = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

  // fuori mappa
  if (tx < 0 || ty < 0 || tx >= MAP_COLS || ty >= MAP_ROWS) return;

  // tile bloccata
  if (collisionMap[ty][tx] === 1) return;

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
