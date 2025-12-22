// ===== LOGIN CHECK =====
const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ===== AVATAR =====
const avatar = JSON.parse(localStorage.getItem("avatar_" + username)) || {
  face: 0,
  robe: 0
};

const faces = ["face1.png", "face2.png", "face3.png"];
const robes = ["robe1.png", "robe2.png", "robe3.png"];

const faceImg = document.getElementById("face");
const robeImg = document.getElementById("robe");

faceImg.src = "/images/avatars/face/" + faces[avatar.face];
robeImg.src = "/images/avatars/robe/" + robes[avatar.robe];

// ===== MAPPA LOGICA (RETTANGOLARE) =====
const COLS = 16;
const ROWS = 12;

// ===== RENDER ISOMETRICO (HABBO-LIKE) =====
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const floor = document.getElementById("floor");
const player = document.getElementById("player");

// ===== POSIZIONE LOGICA PG =====
let gridX = 7;
let gridY = 6;

// ===== DIREZIONE (LOGICA) =====
let lastX = gridX;
let lastY = gridY;
let direction = "front";

// ===== DISEGNO PAVIMENTO ISOMETRICO =====
floor.innerHTML = "";

for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    const screenX = (x - y) * (ISO_W / 2);
    const screenY = (x + y) * (ISO_H / 2);

    tile.style.left = screenX + "px";
    tile.style.top = screenY + "px";
    tile.style.zIndex = x + y;

    floor.appendChild(tile);
  }
}

// ===== CONVERSIONE LOGICA → ISO =====
function isoPos(x, y) {
  return {
    x: (x - y) * (ISO_W / 2),
    y: (x + y) * (ISO_H / 2)
  };
}

// ===== AGGIORNA POSIZIONE PG =====
function updatePlayer() {
  // DIREZIONE LOGICA
  if (gridX > lastX) direction = "right";
  else if (gridX < lastX) direction = "left";
  else if (gridY > lastY) direction = "front";
  else if (gridY < lastY) direction = "back";

  lastX = gridX;
  lastY = gridY;

  // ORIENTAMENTO VISIVO (SENZA CAMBIARE IMMAGINE)
  if (direction === "left") {
    player.style.transform = "scaleX(-1)";
  } else if (direction === "right") {
    player.style.transform = "scaleX(1)";
  } else {
    player.style.transform = "scaleX(1)";
  }

  // POSIZIONE ISO
  const pos = isoPos(gridX, gridY);
  const floorRect = floor.getBoundingClientRect();
  const roomRect = room.getBoundingClientRect();

  player.style.left =
    (floorRect.left - roomRect.left + pos.x - player.offsetWidth / 2) + "px";

  player.style.top =
    (floorRect.top - roomRect.top + pos.y - player.offsetHeight + 16) + "px";

  // PROFONDITÀ (HABBO STYLE)
  player.style.zIndex = gridX + gridY + 10;
}

// ===== CLICK HABBO-LIKE (SUL PAVIMENTO) =====
floor.addEventListener("click", e => {
  const floorRect = floor.getBoundingClientRect();
  const mx = e.clientX - floorRect.left;
  const my = e.clientY - floorRect.top;

  const isoX = mx / (ISO_W / 2);
  const isoY = my / (ISO_H / 2);

  const x = Math.floor((isoY + isoX) / 2);
  const y = Math.floor((isoY - isoX) / 2);

  if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
    gridX = x;
    gridY = y;
    updatePlayer();
  }
});

// ===== INIT =====
updatePlayer();
