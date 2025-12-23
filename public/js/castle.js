// ====== CANVAS SAFE ======
const canvas = document.getElementById("game");

if (!canvas) {
  alert("ERRORE: canvas #game non trovato");
  throw new Error("Canvas non trovato");
}

const ctx = canvas.getContext("2d");

// resize reale (NON solo CSS)
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ====== COSTANTI ======
const TILE_W = 64;
const TILE_H = 32;

const PLAYER_SCALE = 0.8;
const FURNI_SCALE = 0.7;

const MAP_W = 10;
const MAP_H = 10;

// ====== CAMERA ======
const camera = {
  x: canvas.width / 2,
  y: 180
};

// ====== PLAYER ======
const player = {
  x: 4,
  y: 4,
  dir: "s",
  img: new Image()
};

player.img.src = "/images/avatars/robe/s/robe1.png";

// ====== FURNI ======
function loadImg(path) {
  const img = new Image();
  img.src = path;
  return img;
}

const furni = [
  { x: 3, y: 4, img: loadImg("/images/furni/bookshelf.png") },
  { x: 5, y: 5, img: loadImg("/images/furni/chest.png") },
  { x: 6, y: 3, img: loadImg("/images/furni/table.png") }
];

// ====== ISO ======
function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + camera.x,
    y: (x + y) * TILE_H / 2 + camera.y
  };
}

// ====== CLICK ======
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - camera.x;
  const my = e.clientY - rect.top - camera.y;

  const tx = Math.round((my / (TILE_H / 2) + mx / (TILE_W / 2)) / 2);
  const ty = Math.round((my / (TILE_H / 2) - mx / (TILE_W / 2)) / 2);

  if (tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H) {
    player.x = tx;
    player.y = ty;
  }
});

// ====== GRID ======
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x < MAP_W; x++) {
    for (let y = 0; y < MAP_H; y++) {
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

// ====== LOOP ======
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  const drawables = [];

  furni.forEach(f => {
    drawables.push({
      z: f.x + f.y,
      draw: () => {
        const p = isoToScreen(f.x, f.y);
        const w = f.img.width * FURNI_SCALE;
        const h = f.img.height * FURNI_SCALE;
        ctx.drawImage(f.img, p.x - w / 2, p.y - h + TILE_H, w, h);
      }
    });
  });

  drawables.push({
    z: player.x + player.y,
    draw: () => {
      const p = isoToScreen(player.x, player.y);
      const w = player.img.width * PLAYER_SCALE;
      const h = player.img.height * PLAYER_SCALE;
      ctx.drawImage(player.img, p.x - w / 2, p.y - h + TILE_H, w, h);
    }
  });

  drawables.sort((a, b) => a.z - b.z);
  drawables.forEach(d => d.draw());

  requestAnimationFrame(draw);
}

draw();
