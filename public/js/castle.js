const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// TILE
const TILE_W = 64;
const TILE_H = 32;

// SCALE
const PLAYER_SCALE = 0.8;
const FURNI_SCALE  = 0.7;

// MAPPA
const MAP_W = 10;
const MAP_H = 10;

// CAMERA
const camera = { x: canvas.width / 2, y: 150 };

// PLAYER
const player = {
  x: 4,
  y: 4,
  dir: "s",
  img: new Image()
};

player.img.src = "/images/avatars/robe/s/robe1.png";

// FURNI
const furni = [
  { x: 3, y: 4, img: loadFurno("bookshelf.png") },
  { x: 5, y: 5, img: loadFurno("chest.png") },
  { x: 6, y: 3, img: loadFurno("table.png") }
];

function loadFurno(name) {
  const img = new Image();
  img.src = "/images/furni/" + name;
  return img;
}

// ISO
function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2 + camera.x,
    y: (x + y) * TILE_H / 2 + camera.y
  };
}

// CLICK → TILE
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

// DRAW
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  const drawables = [];

  // FURNI
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

  // PLAYER
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
