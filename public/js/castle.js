const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// resize
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// PLAYER
const playerImg = new Image();
playerImg.src = "/images/avatars/robe/e.png";

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  w: 48,
  h: 72
};

// FURNI
const furniImg = {
  chest: new Image(),
  bookshelf: new Image(),
  table: new Image()
};

furniImg.chest.src = "/images/furni/chest.png";
furniImg.bookshelf.src = "/images/furni/bookshelf.png";
furniImg.table.src = "/images/furni/table.png";

const furni = [
  { type: "chest", x: player.x - 100, y: player.y + 40, w: 64, h: 48 },
  { type: "bookshelf", x: player.x + 80, y: player.y - 40, w: 64, h: 96 },
  { type: "table", x: player.x + 20, y: player.y + 100, w: 64, h: 48 }
];

// CLICK
canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  furni.forEach(f => {
    if (mx >= f.x && mx <= f.x + f.w && my >= f.y && my <= f.y + f.h) {
      alert("Hai cliccato: " + f.type);
    }
  });
});

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // furni
  furni.forEach(f => {
    ctx.drawImage(furniImg[f.type], f.x, f.y, f.w, f.h);
  });

  // player
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  requestAnimationFrame(draw);
}

draw();
