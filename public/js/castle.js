const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_W = 64;
const TILE_H = 32;
const GRID_SIZE = 8;
const SPEED = 0.08;

const originX = canvas.width / 2;
const originY = canvas.height / 3;

// ================= PLAYER =================
const player = {
  x: 3,
  y: 3,
  drawX: 0,
  drawY: 0,
  dir: "s",
  img: new Image()
};

let target = null;

// ================= IMAGES =================
function loadAvatar() {
  player.img.src = `/images/avatars/robe/${player.dir}/robe1.png`;
}

loadAvatar();

// ================= ISO =================
function isoToScreen(x, y) {
  return {
    x: originX + (x - y) * TILE_W / 2,
    y: originY + (x + y) * TILE_H / 2
  };
}

function screenToIso(mx, my) {
  const x = ((mx - originX) / (TILE_W / 2) + (my - originY) / (TILE_H / 2)) / 2;
  const y = ((my - originY) / (TILE_H / 2) - (mx - originX) / (TILE_W / 2)) / 2;
  return { x: Math.round(x), y: Math.round(y) };
}

// ================= DRAW =================
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const p = isoToScreen(x, y);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + TILE_W / 2, p.y + TILE_H / 2);
      ctx.lineTo(p.x, p.y + TILE_H);
      ctx.lineTo(p.x - TILE_W / 2, p.y + TILE_H / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawPlayer() {
  const p = isoToScreen(player.x, player.y);
  ctx.drawImage(player.img, p.x - 32, p.y - 64, 64, 96);
}

// ================= MOVEMENT =================
function updateDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }
  loadAvatar();
}

function updateMovement() {
  if (!target) return;

  const dx = target.x - player.x;
  const dy = target.y - player.y;

  if (Math.abs(dx) < SPEED && Math.abs(dy) < SPEED) {
    player.x = target.x;
    player.y = target.y;
    target = null;
    return;
  }

  player.x += Math.sign(dx) * SPEED;
  player.y += Math.sign(dy) * SPEED;
}

// ================= LOOP =================
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  updateMovement();
  drawPlayer();
  requestAnimationFrame(loop);
}

loop();

// ================= CLICK =================
canvas.addEventListener("click", (e) => {
  const pos = screenToIso(e.clientX, e.clientY);

  if (
    pos.x < 0 || pos.y < 0 ||
    pos.x >= GRID_SIZE || pos.y >= GRID_SIZE
  ) return;

  target = { x: pos.x, y: pos.y };
  updateDirection(target.x - player.x, target.y - player.y);
});
