const rows = 10;
const cols = 10;

let playerPos = { x: 4, y: 4 };

// Mappa con celle
const mapContainer = document.getElementById("map");
let cells = [];

// Creazione griglia
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");

    // Muri esterni
    if (x === 0 || x === cols -1 || y === 0 || y === rows -1) {
      cell.classList.add("wall");
    } else {
      cell.classList.add("floor");
    }

    mapContainer.appendChild(cell);
    cells.push({ el: cell, x, y });
  }
}

// disegna player
function drawPlayer() {
  cells.forEach(c => c.el.classList.remove("player"));
  const cell = cells.find(c => c.x === playerPos.x && c.y === playerPos.y);
  if(cell) cell.el.classList.add("player");
}

drawPlayer();

// Movimento con funzioni
function move(dir) {
  let newX = playerPos.x;
  let newY = playerPos.y;

  if(dir === "up") newY--;
  if(dir === "down") newY++;
  if(dir === "left") newX--;
  if(dir === "right") newX++;

  // Verifica muri
  const target = cells.find(c => c.x === newX && c.y === newY);
  if(target && !target.el.classList.contains("wall")) {
    playerPos.x = newX;
    playerPos.y = newY;
    drawPlayer();
  }
}

// Movimento con tastiera
document.addEventListener("keydown", (e) => {
  if(e.key === "ArrowUp") move("up");
  if(e.key === "ArrowDown") move("down");
  if(e.key === "ArrowLeft") move("left");
  if(e.key === "ArrowRight") move("right");
});
