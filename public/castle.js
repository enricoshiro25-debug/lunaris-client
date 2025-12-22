const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ===== AVATAR =====
const avatar = JSON.parse(localStorage.getItem("avatar_" + username)) || {
  face: 0,
  robe: 0
};

const faces = ["face1.png","face2.png","face3.png"];
const robes = ["robe1.png","robe2.png","robe3.png"];

document.getElementById("face").src =
  "/images/avatars/face/" + faces[avatar.face];
document.getElementById("robe").src =
  "/images/avatars/robe/" + robes[avatar.robe];

// ===== LOGICA RETTANGOLARE (HABBO-LIKE) =====
const COLS = 16;
const ROWS = 12;

// ===== RENDER ISOMETRICO =====
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const floor = document.getElementById("floor");
const player = document.getElementById("player");

// posizione logica (come prima)
let gridX = 7;
let gridY = 6;

// ===== DISEGNO PAVIMENTO =====
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    const screenX = (x - y) * (ISO_W / 2);
    const screenY = (x + y) * (ISO_H / 2);

    tile.style.left = screenX + "px";
    tile.style.top = screenY + "px";

    floor.appendChild(tile);
  }
}

// ===== POSIZIONAMENTO PG (DA LOGICA → ISO) =====
function isoPos(x, y) {
  return {
    x: (x - y) * (ISO_W / 2),
    y: (x + y) * (ISO_H / 2)
  };
}

function updatePlayer() {
  const pos = isoPos(gridX, gridY);

  const floorRect = floor.getBoundingClientRect();
  const roomRect = room.getBoundingClientRect();

  player.style.left =
    (floorRect.left - roomRect.left + pos.x - player.offsetWidth / 2) + "px";

  player.style.top =
    (floorRect.top - roomRect.top + pos.y - player.offsetHeight + 16) + "px";
}

// ===== CLICK HABBO-LIKE (LOGICA RETTANGOLARE) =====
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const relX = mx / rect.width;
  const relY = my / rect.height;

  gridX = Math.floor(relX * COLS);
  gridY = Math.floor(relY * ROWS);

  updatePlayer();
});

updatePlayer();
