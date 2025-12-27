const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_Y = 240;

/* ================= ISO ================= */

function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + canvas.width / 2,
    y: (x + y) * TILE_H / 2 + ORIGIN_Y
  };
}

/* ================= PLAYER ================= */

const player = {
  x: 4,
  y: 5,
  dir: "s",
  frame: 0,
  target: null,
  moving: false
};

function load(src) {
  const i = new Image();
  i.src = src;
  return i;
}

const playerImg = {
  n: [load("/images/avatars/robe/n/robe1_0.png"), load("/images/avatars/robe/n/robe1_1.png")],
  s: [load("/images/avatars/robe/s/robe1_0.png"), load("/images/avatars/robe/s/robe1_1.png")],
  e: [load("/images/avatars/robe/e/robe1_0.png"), load("/images/avatars/robe/e/robe1_1.png")],
  w: [load("/images/avatars/robe/w/robe1_0.png"), load("/images/avatars/robe/w/robe1_1.png")]
};

/* ================= FURNI (SCALE CORRETTE) ================= */

const furni = [
  { img: load("/images/furni/bookshelf.png"), x: 4, y: 3, scale: 0.38 },
  { img: load("/images/furni/chest.png"),     x: 5, y: 4, scale: 0.32 },
  { img: load("/images/furni/table.png"),     x: 6, y: 3, scale: 0.36 }
];

/* ================= INPUT ================= */

canvas.addEventListener("click", e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left - canvas.width / 2;
  const my = e.clientY - r.top - ORIGIN_Y;

  const tx = Math.round(my / TILE_H + mx / TILE_W);
  const ty = Math.round(my / TILE_H - mx / TILE_W);

  player.target = { x: tx, y: ty };
  player.moving = true;
});

/* ================= UPDATE ================= */

function update() {
  if (!player.moving || !player.target) return;

  const dx = player.target.x - player.x;
  const dy = player.target.y - player.y;

  // movimento
  player.x += Math.sign(dx) * 0.06;
  player.y += Math.sign(dy) * 0.06;

  /* ===== DIREZIONE ISO CORRETTA ===== */
  if (dx > 0 && dy > 0) player.dir = "s";
  else if (dx < 0 && dy < 0) player.dir = "n";
  else if (dx > 0 && dy < 0) player.dir = "e";
  else if (dx < 0 && dy > 0) player.dir = "w";

  // stop
  if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
    player.x = player.target.x;
    player.y = player.target.y;
    player.moving = false;
    player.frame = 0;
  } else {
    player.frame = (player.frame + 0.15) % 2;
  }
}

/* ================= DRAW ================= */

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
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

  const entities = [];

  furni.forEach(f => {
    const p = isoToScreen(f.x, f.y);
    entities.push({
      y: f.y,
      draw: () => ctx.drawImage(
        f.img,
        p.x - f.img.width * f.scale / 2,
        p.y - f.img.height * f.scale + 10,
        f.img.width * f.scale,
        f.img.height * f.scale
      )
    });
  });

  const pp = isoToScreen(player.x, player.y);
  const img = playerImg[player.dir][Math.floor(player.frame)];

  entities.push({
    y: player.y,
    draw: () => ctx.drawImage(img, pp.x - 32, pp.y - 72, 64, 80)
  });

  entities.sort((a, b) => a.y - b.y).forEach(e => e.draw());
}

/* ================= LOOP ================= */

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
