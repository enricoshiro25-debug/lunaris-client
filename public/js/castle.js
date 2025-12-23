const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   TILE & MAP
========================= */
const TILE_W = 64;
const TILE_H = 32;
const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = canvas.width / 2;
const ORIGIN_Y = 180;

/* =========================
   PLAYER
========================= */
const player = {
  tx: 4,
  ty: 4,
  x: 4,
  y: 4,
  dir: "s",
  speed: 0.12,
  img: new Image()
};

function loadPlayer() {
  player.img.src = `/images/avatars/robe/${player.dir}/robe1.png`;
}
loadPlayer();

/* =========================
   FURNI (HABBO SCALE)
========================= */
const furni = [
  {
    x: 3,
    y: 4,
    w: 64,
    h: 128,
    img: loadImg("/images/furni/bookshelf.png")
  },
  {
    x: 5,
    y: 5,
    w: 64,
    h: 64,
    img: loadImg("/images/furni/chest.png")
  },
  {
    x: 6,
    y: 3,
    w: 64,
    h: 64,
    img: loadImg("/images/furni/table.png")
  }
];

function loadImg(src) {
  const i = new Image();
  i.src = src;
  return i;
}

/* =========================
   COLLISION
========================= */
function isBlocked(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return true;
  return furni.some(f => f.x === x && f.y === y);
}

/* =========================
   ISO CONVERSION (FIXED)
========================= */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
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
   CLICK MOVE (PRECISE)
========================= */
canvas.addEventListener("click", e => {
  const t = screenToIso(e.offsetX, e.offsetY);
  if (isBlocked(t.x, t.y)) return;

  if (t.x > player.tx) player.dir = "e";
  else if (t.x < player.tx) player.dir = "w";
  else if (t.y > player.ty) player.dir = "s";
  else if (t.y < player.ty) player.dir = "n";

  player.tx = t.x;
  player.ty = t.y;
  loadPlayer();
});

/* =========================
   UPDATE
========================= */
function updatePlayer() {
  player.x += (player.tx - player.x) * player.speed;
  player.y += (player.ty - player.y) * player.speed;
}

/* =========================
   DRAW GRID (DEBUG)
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
   DEPTH SORT
========================= */
function drawScene() {
  const list = [];

  furni.forEach(f => {
    const p = isoToScreen(f.x, f.y);
    list.push({
      z: f.y,
      draw: () =>
        ctx.drawImage(
          f.img,
          p.x - f.w / 2,
          p.y - f.h,
          f.w,
          f.h
        )
    });
  });

  const pp = isoToScreen(player.x, player.y);
  list.push({
    z: player.y,
    draw: () =>
      ctx.drawImage(
        player.img,
        pp.x - 32,
        pp.y - 96,
        64,
        96
      )
  });

  list.sort((a, b) => a.z - b.z);
  list.forEach(o => o.draw());
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
