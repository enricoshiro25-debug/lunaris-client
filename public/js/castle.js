const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================
// TILE / MAP
// ==================
const TILE_W = 64;
const TILE_H = 32;

const MAP_W = 10;
const MAP_H = 10;

const ORIGIN_X = canvas.width / 2;
const ORIGIN_Y = 200;

// ==================
// PLAYER
// ==================
const player = {
  x: 5,
  y: 5,
  px: 5,
  py: 5,
  direction: "s",
  moving: false,
  frame: 0,
  frameTick: 0,
  speed: 0.1
};

// ==================
// IMMAGINE PLAYER
// ==================
const playerImg = new Image();
playerImg.src = `/images/avatars/robe/s/robe1_0.png`;

// ==================
// FURNI
// ==================
const furni = [
  { x: 4, y: 3, img: "/images/furni/bookshelf.png" },
  { x: 5, y: 4, img: "/images/furni/chest.png" },
  { x: 6, y: 3, img: "/images/furni/table.png" }
];

const furniImages = {};
furni.forEach(f => {
  const img = new Image();
  img.src = f.img;
  furniImages[f.img] = img;
});

// ==================
// ISO CONVERSION
// ==================
function iso(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + ORIGIN_X,
    y: (x + y) * (TILE_H / 2) + ORIGIN_Y
  };
}

// ==================
// CLICK MOVEMENT
// ==================
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - ORIGIN_X;
  const my = e.clientY - rect.top - ORIGIN_Y;

  const tx = Math.floor(my / TILE_H + mx / TILE_W);
  const ty = Math.floor(my / TILE_H - mx / TILE_W);

  player.x = Math.max(0, Math.min(MAP_W - 1, tx));
  player.y = Math.max(0, Math.min(MAP_H - 1, ty));
  player.moving = true;

  const dx = player.x - player.px;
  const dy = player.y - player.py;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.direction = dx > 0 ? "e" : "w";
  } else {
    player.direction = dy > 0 ? "s" : "n";
  }
});

// ==================
// UPDATE
// ==================
function update() {
  if (player.moving) {
    const dx = player.x - player.px;
    const dy = player.y - player.py;

    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      player.px = player.x;
      player.py = player.y;
      player.moving = false;
      player.frame = 0;
    } else {
      player.px += dx * player.speed;
      player.py += dy * player.speed;

      player.frameTick++;
      if (player.frameTick > 12) {
        player.frame = player.frame === 0 ? 1 : 0;
        player.frameTick = 0;
      }
    }
  }

  playerImg.src = `/images/avatars/robe/${player.direction}/robe1_${player.frame}.png`;
}

// ==================
// DRAW
// ==================
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let x = 0; x < MAP_W; x++) {
    for (let y = 0; y < MAP_H; y++) {
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  // furni
  furni.forEach(f => {
    const p = iso(f.x, f.y);
    ctx.drawImage(furniImages[f.img], p.x - 64, p.y - 96);
  });

  // player
  const p = iso(player.px, player.py);
  ctx.drawImage(playerImg, p.x - 32, p.y - 80);
}

// ==================
// LOOP
// ==================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
