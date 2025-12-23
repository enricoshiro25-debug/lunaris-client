const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =====================
   MAP
===================== */
const TILE_W = 64;
const TILE_H = 32;
const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = canvas.width / 2;
const ORIGIN_Y = 180;

/* =====================
   PLAYER
===================== */
const player = {
  x: 4,
  y: 4,
  tx: 4,
  ty: 4,
  dir: "s",
  speed: 0.08,
  moving: false,
  img: new Image()
};

function loadPlayer() {
  player.img.src = `/images/avatars/robe/${player.dir}/robe1.png`;
}
loadPlayer();

/* =====================
   FURNI
===================== */
function img(src) {
  const i = new Image();
  i.src = src;
  return i;
}

const furni = [
  { x: 3, y: 4, img: img("/images/furni/bookshelf.png") },
  { x: 5, y: 5, img: img("/images/furni/chest.png") },
  { x: 6, y: 3, img: img("/images/furni/table.png") }
];

/* =====================
   ISO
===================== */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

function screenToIso(mx, my) {
  mx -= ORIGIN_X;
  my -= ORIGIN_Y;

  return {
    x: Math.floor((mx / (TILE_W / 2) + my / (TILE_H / 2)) / 2),
    y: Math.floor((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2)
  };
}

/* =====================
   COLLISION
===================== */
function furnoAt(x, y) {
  return furni.find(f => f.x === x && f.y === y);
}

function blocked(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return true;
  return furnoAt(x, y);
}

/* =====================
   HABBO ADJACENT TILE
===================== */
function adjacent(f) {
  const list = [
    { x: f.x, y: f.y + 1, dir: "n" },
    { x: f.x, y: f.y - 1, dir: "s" },
    { x: f.x - 1, y: f.y, dir: "e" },
    { x: f.x + 1, y: f.y, dir: "w" }
  ];
  return list.find(p => !blocked(p.x, p.y));
}

/* =====================
   CLICK
===================== */
canvas.addEventListener("click", e => {
  if (player.moving) return;

  const t = screenToIso(e.offsetX, e.offsetY);
  const f = furnoAt(t.x, t.y);

  let dest = t;

  if (f) {
    const a = adjacent(f);
    if (!a) return;
    dest = a;
    player.dir = a.dir;
  } else {
    if (blocked(t.x, t.y)) return;

    if (t.x > player.x) player.dir = "e";
    else if (t.x < player.x) player.dir = "w";
    else if (t.y > player.y) player.dir = "s";
    else if (t.y < player.y) player.dir = "n";
  }

  player.tx = dest.x;
  player.ty = dest.y;
  player.moving = true;
  loadPlayer();
});

/* =====================
   UPDATE
===================== */
function updatePlayer() {
  if (!player.moving) return;

  const dx = player.tx - player.x;
  const dy = player.ty - player.y;

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  if (Math.abs(dx) < 0.02 && Math.abs(dy) < 0.02) {
    player.x = player.tx;
    player.y = player.ty;
    player.moving = false;
  }
}

/* =====================
   DRAW
===================== */
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  furni.forEach(f => {
    const p = isoToScreen(f.x, f.y);
    ctx.drawImage(f.img, p.x - 32, p.y - 64);
  });

  const p = isoToScreen(player.x, player.y);
  ctx.drawImage(player.img, p.x - 32, p.y - 64);
}

/* =====================
   LOOP
===================== */
function loop() {
  updatePlayer();
  draw();
  requestAnimationFrame(loop);
}
loop();
