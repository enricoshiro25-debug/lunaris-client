const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_W = 64;
const TILE_H = 32;
const MAP_W = 10;
const MAP_H = 10;

const offsetX = canvas.width / 2;
const offsetY = 150;

// PLAYER
const player = {
  x: 4,
  y: 4,
  dir: "s",
  img: new Image()
};

function loadPlayer() {
  player.img.src = `images/avatars/robe/${player.dir}/robe1.png`;
}
loadPlayer();

// FURNI
const furni = [
  { x: 6, y: 5, img: "images/furni/chest.png" },
  { x: 3, y: 6, img: "images/furni/bookshelf.png" },
  { x: 5, y: 3, img: "images/furni/table.png" }
];

furni.forEach(f => {
  f.image = new Image();
  f.image.src = f.img;
});

// ISO CONVERSION
function iso(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + offsetX,
    y: (x + y) * TILE_H / 2 + offsetY
  };
}

// CLICK MOVEMENT
canvas.addEventListener("click", e => {
  const mx = e.offsetX - offsetX;
  const my = e.offsetY - offsetY;

  const ty = Math.floor((my / TILE_H + mx / TILE_W));
  const tx = Math.floor((my / TILE_H - mx / TILE_W));

  if (tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H) {
    if (tx > player.x) player.dir = "e";
    if (tx < player.x) player.dir = "w";
    if (ty > player.y) player.dir = "s";
    if (ty < player.y) player.dir = "n";

    player.x = tx;
    player.y = ty;
    loadPlayer();
  }
});

// DRAW
function drawGrid() {
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const p = iso(x, y);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
    ctx.drawImage(f.image, p.x - 32, p.y - 64, 64, 64);
  });
}

function drawPlayer() {
  const p = iso(player.x, player.y);
  ctx.drawImage(player.img, p.x - 32, p.y - 64, 64, 96);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFurni();
  drawPlayer();
  requestAnimationFrame(loop);
}

loop();
