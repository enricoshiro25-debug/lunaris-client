const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_W = 64;
const TILE_H = 32;
const GRID_W = 10;
const GRID_H = 10;

// PLAYER
const playerImg = new Image();
playerImg.src = "images/avatars/robe/e/robe.png"; // PERCORSO RELATIVO

const player = {
  x: 4,
  y: 4,
  tx: 4,
  ty: 4,
  speed: 0.15
};

// FURNI
const furni = [
  { x: 6, y: 4, img: "images/furni/bookshelf.png" },
  { x: 5, y: 5, img: "images/furni/chest.png" },
  { x: 6, y: 5, img: "images/furni/table.png" }
];

const furniImgs = {};
furni.forEach(f => {
  const i = new Image();
  i.src = f.img;
  furniImgs[f.img] = i;
});

function iso(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + canvas.width / 2,
    y: (x + y) * TILE_H / 2 + 100
  };
}

canvas.addEventListener("click", e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left - canvas.width / 2;
  const my = e.clientY - r.top - 100;

  const tx = Math.floor((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const ty = Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  if (tx >= 0 && ty >= 0 && tx < GRID_W && ty < GRID_H) {
    player.tx = tx;
    player.ty = ty;
  }
});

function update() {
  player.x += (player.tx - player.x) * player.speed;
  player.y += (player.ty - player.y) * player.speed;
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const p = iso(x, y);
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

function drawFurni() {
  furni.forEach(f => {
    const p = iso(f.x, f.y);
    const img = furniImgs[f.img];
    if (img.complete) {
      ctx.drawImage(img, p.x - img.width / 2, p.y - img.height + 16);
    }
  });
}

function drawPlayer() {
  const p = iso(player.x, player.y);
  if (playerImg.complete) {
    ctx.drawImage(playerImg, p.x - 32, p.y - 64, 64, 64);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFurni();
  drawPlayer();
  update();
  requestAnimationFrame(loop);
}

loop();
