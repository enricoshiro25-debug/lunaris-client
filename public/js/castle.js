const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   MAP
========================= */
const TILE_W = 64;
const TILE_H = 32;
const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = canvas.width / 2;
const ORIGIN_Y = 200;

/* =========================
   PLAYER
========================= */
const player = {
  x: 4,
  y: 4,
  px: 4,
  py: 4,
  dir: "s",
  speed: 0.08,
  img: new Image()
};

function loadPlayer() {
  player.img.src = `images/avatars/robe/${player.dir}/robe1.png`;
}
loadPlayer();

/* =========================
   FURNI (1 tile each)
========================= */
const furni = [
  { x: 3, y: 4, w: 64, h: 96, src: "images/furni/bookshelf.png" },
  { x: 5, y: 5, w: 64, h: 64, src: "images/furni/chest.png" },
  { x: 6, y: 3, w: 64, h: 64, src: "images/furni/table.png" }
];

furni.forEach(f => {
  f.img = new Image();
  f.img.src = f.src;
});

/* =========================
   COLLISION MAP
========================= */
function isBlocked(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return true;
  return furni.some(f => f.x === x && f.y === y);
}

/* =========================
   ISO UTILS
========================= */
function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + ORIGIN_X,
    y: (x + y) * TILE_H / 2 + ORIGIN_Y
  };
}

function screenToIso(mx, my) {
  mx -= ORIGIN_X;
  my -= ORIGIN_Y;
  const x = Math.floor((mx / (TILE_W / 2) + my / (TILE_H / 2)) / 2);
  const y = Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);
  return { x, y };
}

/* =========================
   CLICK MOVE
========================= */
canvas.addEventListener("click", e => {
  const t = screenToIso(e.offsetX, e.offsetY);

  if (isBlocked(t.x, t.y)) return;

  if (t.x > player.x) player.dir = "e";
  else if (t.x < player.x) player.dir = "w";
  else if (t.y > player.y) player.dir = "s";
  else if (t.y < player.y) player.dir = "n";

  player.x = t.x;
  player.y = t.y;
  loadPlayer();
});

/* =========================
   UPDATE
========================= */
function updatePlayer() {
  player.px += (player.x - player.px) * player.speed;
  player.py += (player.y - player.py) * player.speed;
}

/* =========================
   DRAW GRID
========================= */
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
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

/* =========================
   DRAW SORTED
========================= */
function drawScene() {
  const objects = [];

  furni.forEach(f => {
    const p = isoToScreen(f.x, f.y);
    objects.push({
      y: f.y,
      draw: () => ctx.drawImage(f.img, p.x - f.w / 2, p.y - f.h, f.w, f.h)
    });
  });

  const pp = isoToScreen(player.px, player.py);
  objects.push({
    y: player.py,
    draw: () =>
      ctx.drawImage(player.img, pp.x - 32, pp.y - 96, 64, 96)
  });

  objects.sort((a, b) => a.y - b.y);
  objects.forEach(o => o.draw());
}

/* =========================
   LOOP
========================= */
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawGrid();
  drawScene();
  requestAnimationFrame(loop);
}

loop();
