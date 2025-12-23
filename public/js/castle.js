console.log("CASTLE JS 11.2 CARICATO");

const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.1; // più basso = più lento

const player = {
  tileX: 5,
  tileY: 5,
  targetX: 5,
  targetY: 5,
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
// POSIZIONE
// =========================
function updatePosition() {
  playerEl.style.left = player.screenX + "px";
  playerEl.style.top = player.screenY + "px";
}

// =========================
// INIT
// =========================
const startPos = isoToScreen(player.tileX, player.tileY);
player.screenX = startPos.x;
player.screenY = startPos.y;

updateAvatar();
updatePosition();

// =========================
// CLICK → DESTINAZIONE
// =========================
document.addEventListener("click", e => {
  const dx = e.clientX - window.innerWidth / 2;
  const dy = e.clientY - 150;

  const tx = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const ty = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

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
// MOVIMENTO FLUIDO
// =========================
function gameLoop() {
  const targetPos = isoToScreen(player.targetX, player.targetY);

  player.screenX += (targetPos.x - player.screenX) * MOVE_SPEED;
  player.screenY += (targetPos.y - player.screenY) * MOVE_SPEED;

  if (
    Math.abs(player.screenX - targetPos.x) < 1 &&
    Math.abs(player.screenY - targetPos.y) < 1
  ) {
    player.tileX = player.targetX;
    player.tileY = player.targetY;
    player.screenX = targetPos.x;
    player.screenY = targetPos.y;
  }

  updatePosition();
  requestAnimationFrame(gameLoop);
}

gameLoop();
