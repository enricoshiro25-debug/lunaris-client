const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =======================
   CONFIG ISOMETRICA
======================= */
const TILE_W = 64;
const TILE_H = 32;
const MOVE_SPEED = 0.08; // velocità reale (NO TELEPORT)

/* =======================
   UTILS
======================= */
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + canvas.width / 2,
    y: (x + y) * (TILE_H / 2) + 150
  };
}

function screenToIso(x, y) {
  const cx = x - canvas.width / 2;
  const cy = y - 150;
  return {
    x: (cx / (TILE_W / 2) + cy / (TILE_H / 2)) / 2,
    y: (cy / (TILE_H / 2) - cx / (TILE_W / 2)) / 2
  };
}

/* =======================
   PLAYER
======================= */
const player = {
  x: 5,
  y: 5,
  tx: 5,
  ty: 5,
  dir: "s",
  img: new Image()
};

function loadPlayer() {
  player.img.src = `/images/avatars/robe/${player.dir}/robe1.png`;
}
loadPlayer();

/* =======================
   FURNI
======================= */
const furni = [
  { x: 4, y: 6, img: loadImg("/images/furni/bookshelf.png") },
  { x: 6, y: 6, img: loadImg("/images/furni/chest.png") },
  { x: 5, y: 4, img: loadImg("/images/furni/table.png") }
];

function loadImg(src) {
  const i = new Image();
  i.src = src;
  return i;
}

/* =======================
   CLICK MOVIMENTO
======================= */
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const iso = screenToIso(e.clientX - rect.left, e.clientY - rect.top);

  player.tx = Math.round(iso.x);
  player.ty = Math.round(iso.y);

  const dx = player.tx - player.x;
  const dy = player.ty - player.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.dir = dx > 0 ? "e" : "w";
  } else {
    player.dir = dy > 0 ? "s" : "n";
  }

  loadPlayer();
});

/* =======================
   UPDATE (MOVIMENTO REALE)
======================= */
function update() {
  const dx = player.tx - player.x;
  const dy = player.ty - player.y;

  if (Math.abs(dx) > 0.01) player.x += dx * MOVE_SPEED;
  if (Math.abs(dy) > 0.01) player.y += dy * MOVE_SPEED;
}

/* =======================
   DRAW
======================= */
function drawSprite(img, x, y, foot = 6) {
  const p = isoToScreen(x, y);
  ctx.drawImage(
    img,
    p.x - img.width / 2,
    p.y - img.height + TILE_H + foot
  );
}

function drawGrid() {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const p = isoToScreen(x, y);
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

/* =======================
   LOOP
======================= */
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  drawGrid();

  const drawables = [];

  furni.forEach(f => {
    drawables.push({
      z: f.x + f.y,
      draw: () => drawSprite(f.img, f.x, f.y, 8)
    });
  });

  drawables.push({
    z: player.x + player.y + 0.5,
    draw: () => drawSprite(player.img, player.x, player.y, 6)
  });

  drawables.sort((a, b) => a.z - b.z);
  drawables.forEach(d => d.draw());

  requestAnimationFrame(loop);
}

loop();
