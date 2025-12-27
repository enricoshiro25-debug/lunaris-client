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

function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + canvas.width / 2,
    y: (x + y) * TILE_H / 2 + 200
  };
}

/* ================= PLAYER ================= */

const player = {
  x: 4,
  y: 4,
  dir: "s",
  frame: 0,
  moving: false,
  target: null
};

const robeImages = {};
["n", "s", "e", "w"].forEach(d => {
  robeImages[d] = [
    loadImage(`/images/avatars/robe/${d}/robe1_0.png`),
    loadImage(`/images/avatars/robe/${d}/robe1_1.png`)
  ];
});

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

/* ================= FURNI ================= */

const furni = [
  { img: loadImage("/images/furni/bookshelf.png"), x: 3, y: 3, scale: 0.6 },
  { img: loadImage("/images/furni/chest.png"),     x: 4, y: 3, scale: 0.6 },
  { img: loadImage("/images/furni/table.png"),     x: 5, y: 3, scale: 0.6 }
];

/* ================= INPUT ================= */

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - canvas.width / 2;
  const my = e.clientY - rect.top - 200;

  const tx = Math.round((my / TILE_H) + (mx / TILE_W));
  const ty = Math.round((my / TILE_H) - (mx / TILE_W));

  player.target = { x: tx, y: ty };
  player.moving = true;
});

/* ================= UPDATE ================= */

function update() {
  if (!player.moving || !player.target) return;

  if (player.x < player.target.x) {
    player.x += 0.05;
    player.dir = "s";
  }
  if (player.x > player.target.x) {
    player.x -= 0.05;
    player.dir = "n";
  }
  if (player.y < player.target.y) {
    player.y += 0.05;
    player.dir = "e";
  }
  if (player.y > player.target.y) {
    player.y -= 0.05;
    player.dir = "w";
  }

  if (
    Math.abs(player.x - player.target.x) < 0.05 &&
    Math.abs(player.y - player.target.y) < 0.05
  ) {
    player.x = player.target.x;
    player.y = player.target.y;
    player.moving = false;
  }

  if (player.moving) {
    player.frame = (player.frame + 0.1) % 2;
  } else {
    player.frame = 0;
  }
}

/* ================= DRAW ================= */

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
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

  furni.forEach(f => {
    const p = isoToScreen(f.x, f.y);
    ctx.drawImage(
      f.img,
      p.x - f.img.width * f.scale / 2,
      p.y - f.img.height * f.scale + 16,
      f.img.width * f.scale,
      f.img.height * f.scale
    );
  });

  const p = isoToScreen(player.x, player.y);
  const img = robeImages[player.dir][Math.floor(player.frame)];

  ctx.drawImage(
    img,
    p.x - 32,
    p.y - 64,
    64,
    80
  );
}

/* ================= LOOP ================= */

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
