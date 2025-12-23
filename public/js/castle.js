console.log("CASTLE JS 11.3 CARICATO");

const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.12;
const ANIM_SPEED = 300; // ms

const player = {
  tileX: 5,
  tileY: 5,
  targetX: 5,
  targetY: 5,
  screenX: 0,
  screenY: 0,
  direction: "s",
  robe: "robe1",
  moving: false,
  frame: 0
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
// AVATAR + FRAME
// =========================
function updateAvatar() {
  const frame = player.moving ? player.frame : 0;
  sprite.src = `images/avatars/robe/${player.direction}/${player.robe}_${frame}.png`;
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
const start = isoToScreen(player.tileX, player.tileY);
player.screenX = start.x;
player.screenY = start.y;
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
  player.moving = true;

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
// ANIMAZIONE PASSO
// =========================
setInterval(() => {
  if (player.moving) {
    player.frame = player.frame === 0 ? 1 : 0;
    updateAvatar();
  }
}, ANIM_SPEED);

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
    player.moving = false;
    updateAvatar();
  } else {
    player.screenX += dx * MOVE_SPEED;
    player.screenY += dy * MOVE_SPEED;
  }

  updatePosition();
  requestAnimationFrame(gameLoop);
}

gameLoop();
