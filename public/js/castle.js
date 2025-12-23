const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_W = 64;
const TILE_H = 32;
const GRID_W = 10;
const GRID_H = 10;

let player = {
  x: 5,
  y: 5,
  px: 0,
  py: 0,
  targetX: 5,
  targetY: 5,
  speed: 0.1
};

// carica sprite player (una sola immagine)
const playerImg = new Image();
playerImg.src = "/images/avatars/robe/e/robe.png"; // se non esiste, vedi nota sotto

playerImg.onerror = () => {
  console.warn("Sprite non trovato, uso quadrato temporaneo");
};

function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + canvas.width / 2,
    y: (x + y) * TILE_H / 2 + 100
  };
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - canvas.width / 2;
  const my = e.clientY - rect.top - 100;

  const tx = Math.floor((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const ty = Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  if (tx >= 0 && ty >= 0 && tx < GRID_W && ty < GRID_H) {
    player.targetX = tx;
    player.targetY = ty;
  }
});

function update() {
  player.x += (player.targetX - player.x) * player.speed;
  player.y += (player.targetY - player.y) * player.speed;
}

function drawGrid() {
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const p = isoToScreen(x, y);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
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

  if (playerImg.complete && playerImg.naturalWidth > 0) {
    ctx.drawImage(playerImg, p.x - 32, p.y - 64, 64, 64);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(p.x - 10, p.y - 20, 20, 40);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPlayer();
  update();
  requestAnimationFrame(loop);
}

loop();
