const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ======================
   MAPPA
====================== */
const TILE_W = 64;
const TILE_H = 32;
const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = canvas.width / 2;
const ORIGIN_Y = 180;

/* ======================
   PLAYER
====================== */
const player = {
  x: 5,
  y: 5,
  tx: 5,
  ty: 5,
  dir: "s",
  frame: 0,
  frameTick: 0,
  moving: false
};

const playerImg = new Image();
playerImg.src = "/images/avatars/robe/s/robe1_0.png";

/* ======================
   ISO CONVERSION
====================== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

function screenToIso(mx, my) {
  return {
    x: Math.floor((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2),
    y: Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2)
  };
}

/* ======================
   CLICK (ORA FUNZIONA)
====================== */
canvas.addEventListener("click", e => {
  if (player.moving) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - ORIGIN_X;
  const my = e.clientY - rect.top - ORIGIN_Y;

  const tile = screenToIso(mx, my);

  if (
    tile.x < 0 || tile.y < 0 ||
    tile.x >= MAP_W || tile.y >= MAP_H
  ) return;

  player.tx = tile.x;
  player.ty = tile.y;
  player.moving = true;

  const dx = tile.x - player.x;
  const dy = tile.y - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }
});

/* ======================
   UPDATE
====================== */
function update() {
  if (player.moving) {
    if (player.x === player.tx && player.y === player.ty) {
      player.moving = false;
      player.frame = 0;
    } else {
      if (player.x < player.tx) player.x++;
      else if (player.x > player.tx) player.x--;

      if (player.y < player.ty) player.y++;
      else if (player.y > player.ty) player.y--;

      player.frameTick++;
      if (player.frameTick > 10) {
        player.frame = player.frame === 0 ? 1 : 0;
        player.frameTick = 0;
      }
    }
  }

  playerImg.src = `/images/avatars/robe/${player.dir}/robe1_${player.frame}.png`;
}

/* ======================
   DRAW
====================== */
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x < MAP_W; x++) {
    for (let y = 0; y < MAP_H; y++) {
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  const p = isoToScreen(player.x, player.y);
  ctx.drawImage(playerImg, p.x - 32, p.y - 80);
}

/* ======================
   LOOP
====================== */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
