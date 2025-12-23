const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ================= CONFIG DEFINITIVA ================= */

const TILE_W = 64;
const TILE_H = 32;

const SCALE_PLAYER = 0.40;
const SCALE_FURNI  = 0.35;

const GRID_W = 12;
const GRID_H = 12;

/* ================= CAMERA ================= */

const camera = { x: canvas.width / 2, y: 150 };

/* ================= UTILS ================= */

function isoToScreen(ix, iy) {
  return {
    x: (ix - iy) * TILE_W / 2 + camera.x,
    y: (ix + iy) * TILE_H / 2 + camera.y
  };
}

function screenToIso(x, y) {
  x -= camera.x;
  y -= camera.y;

  return {
    x: Math.floor((y / (TILE_H / 2) + x / (TILE_W / 2)) / 2),
    y: Math.floor((y / (TILE_H / 2) - x / (TILE_W / 2)) / 2)
  };
}

function drawSprite(img, ix, iy, scale, footOffset = 0) {
  if (!img.complete) return;
  const p = isoToScreen(ix, iy);

  const w = img.width * scale;
  const h = img.height * scale;

  ctx.drawImage(
    img,
    p.x - w / 2,
    p.y - h + TILE_H + footOffset,
    w,
    h
  );
}

/* ================= PLAYER ================= */

const player = {
  x: 6,
  y: 6,
  dir: "s",
  target: null,
  speed: 0.05,
  img: new Image()
};

player.img.src = "/images/avatars/robe/s/robe1.png";

/* ================= FURNI ================= */

const furni = [
  { x: 4, y: 6, img: loadFurni("bookshelf.png") },
  { x: 6, y: 7, img: loadFurni("chest.png") },
  { x: 7, y: 5, img: loadFurni("table.png") }
];

function loadFurni(name) {
  const i = new Image();
  i.src = `/images/furni/${name}`;
  return i;
}

/* ================= CLICK MOVE ================= */

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const iso = screenToIso(
    e.clientX - rect.left,
    e.clientY - rect.top
  );

  if (iso.x < 0 || iso.y < 0 || iso.x >= GRID_W || iso.y >= GRID_H) return;

  player.target = { x: iso.x, y: iso.y };

  const dx = iso.x - player.x;
  const dy = iso.y - player.y;

  if (Math.abs(dx) > Math.abs(dy))
    player.dir = dx > 0 ? "e" : "w";
  else
    player.dir = dy > 0 ? "s" : "n";

  player.img.src = `/images/avatars/robe/${player.dir}/robe1.png`;
});

/* ================= UPDATE ================= */

function update() {
  if (player.target) {
    const dx = player.target.x - player.x;
    const dy = player.target.y - player.y;

    if (Math.abs(dx) < 0.02 && Math.abs(dy) < 0.02) {
      player.x = player.target.x;
      player.y = player.target.y;
      player.target = null;
    } else {
      player.x += Math.sign(dx) * player.speed;
      player.y += Math.sign(dy) * player.speed;
    }
  }
}

/* ================= DRAW ================= */

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";

  for (let x = 0; x <= GRID_W; x++) {
    for (let y = 0; y <= GRID_H; y++) {
      const p = isoToScreen(x, y);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + TILE_W / 2, p.y + TILE_H / 2);
      ctx.stroke();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  const drawables = [];

  furni.forEach(f => {
    drawables.push({
      z: f.x + f.y,
      draw: () => drawSprite(f.img, f.x, f.y, SCALE_FURNI, 6)
    });
  });

  drawables.push({
    z: player.x + player.y + 0.5,
    draw: () => drawSprite(player.img, player.x, player.y, SCALE_PLAYER, 4)
  });

  drawables.sort((a, b) => a.z - b.z);
  drawables.forEach(d => d.draw());
}

/* ================= LOOP ================= */

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
