const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ======================
   PLAYER
====================== */
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 48,
  height: 72,
  img: new Image()
};

player.img.src = "/images/avatars/robe/e.png";

/* ======================
   FURNI
====================== */
const furni = [
  {
    type: "chest",
    x: player.x - 120,
    y: player.y + 40,
    width: 64,
    height: 48,
    img: "/images/furni/chest.png"
  },
  {
    type: "bookshelf",
    x: player.x + 80,
    y: player.y - 20,
    width: 64,
    height: 96,
    img: "/images/furni/bookshelf.png"
  },
  {
    type: "table",
    x: player.x + 20,
    y: player.y + 80,
    width: 64,
    height: 48,
    img: "/images/furni/table.png"
  }
];

// carica immagini furni
furni.forEach(f => {
  const image = new Image();
  image.src = f.img;
  f.image = image;
});

/* ======================
   CLICK INTERACTION
====================== */
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  furni.forEach(f => {
    if (
      mouseX >= f.x &&
      mouseX <= f.x + f.width &&
      mouseY >= f.y &&
      mouseY <= f.y + f.height
    ) {
      handleFurniInteraction(f.type);
    }
  });
});

function handleFurniInteraction(type) {
  switch (type) {
    case "chest":
      alert("📦 Hai trovato un oggetto!");
      break;
    case "bookshelf":
      alert("📚 Stai leggendo un libro antico...");
      break;
    case "table":
      alert("🪑 È solo un tavolo.");
      break;
  }
}

/* ======================
   DRAW
====================== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // furni
  furni.forEach(f => {
    ctx.drawImage(f.image, f.x, f.y, f.width, f.height);
  });

  // player
  ctx.drawImage(
    player.img,
    player.x,
    player.y,
    player.width,
    player.height
  );

  requestAnimationFrame(draw);
}

draw();
