// ================= LOGIN CHECK =================
const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ================= AVATAR =================
const avatar = JSON.parse(localStorage.getItem("avatar_" + username)) || {
  face: 0,
  robe: 0
};

const faces = ["face1.png", "face2.png", "face3.png"];
const robes = ["robe1.png", "robe2.png", "robe3.png"];

document.getElementById("face").src =
  "/images/avatars/face/" + faces[avatar.face];
document.getElementById("robe").src =
  "/images/avatars/robe/" + robes[avatar.robe];

// ================= MAPPA =================
const COLS = 16;
const ROWS = 12;
const ISO_W = 64;
const ISO_H = 32;

const room = document.getElementById("room");
const camera = document.getElementById("camera");
const floor = document.getElementById("floor");
const player = document.getElementById("player");

// ================= STATO PG =================
let gridX = 7;
let gridY = 6;

// ================= COLLISIONI =================
const blocked = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(false)
);

// ================= PAVIMENTO =================
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const tile = document.createElement("div");
    tile.className = "tile";

    tile.style.left = (x - y) * (ISO_W / 2) + "px";
    tile.style.top = (x + y) * (ISO_H / 2) + "px";
    tile.style.zIndex = x + y;

    floor.appendChild(tile);
  }
}

// ================= FURNI (1x1) =================
const furniList = [
  { img: "/images/furni/chest.png", x: 6, y: 7, offsetY: 20 },
  { img: "/images/furni/table.png", x: 9, y: 6, offsetY: 28 },
  { img: "/images/furni/bookshelf.png", x: 4, y: 5, offsetY: 48 }
];

furniList.forEach(f => blocked[f.y][f.x] = true);

// ================= ISO POS =================
function isoPos(x, y) {
  return {
    x: (x - y) * (ISO_W / 2),
    y: (x + y) * (ISO_H / 2)
  };
}

// ================= RENDER FURNI =================
function drawFurni() {
  furniList.forEach(f => {
    const el = document.createElement("img");
    el.src = f.img;
    el.className = "furni";

    const pos = isoPos(f.x, f.y);
    el.style.left = pos.x - 32 + "px";
    el.style.top = pos.y - f.offsetY + "px";
    el.style.zIndex = f.x + f.y + 5;

    camera.appendChild(el);
  });
}

// ================= UPDATE PLAYER =================
function updatePlayer() {
  const pos = isoPos(gridX, gridY);

  player.style.left = pos.x - player.offsetWidth / 2 + "px";
  player.style.top = pos.y - player.offsetHeight + 16 + "px";
  player.style.zIndex = gridX + gridY + 10;

  // CAMERA SEGUE PG (HABBO STYLE)
  camera.style.transform =
    `translate(${-pos.x + room.clientWidth / 2}px, ${-pos.y + room.clientHeight / 2}px)`;
}

// ================= PATHFINDING SEMPLICE =================
function findPath(sx, sy, ex, ey) {
  const queue = [{ x: sx, y: sy, path: [] }];
  const visited = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );

  visited[sy][sx] = true;

  const dirs = [
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: -1 }
  ];

  while (queue.length) {
    const cur = queue.shift();
    if (cur.x === ex && cur.y === ey) return cur.path;

    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;

      if (
        nx >= 0 && nx < COLS &&
        ny >= 0 && ny < ROWS &&
        !blocked[ny][nx] &&
        !visited[ny][nx]
      ) {
        visited[ny][nx] = true;
        queue.push({
          x: nx,
          y: ny,
          path: [...cur.path, { x: nx, y: ny }]
        });
      }
    }
  }
  return [];
}

// ================= CAMMINATA =================
let walking = false;

function walkPath(path) {
  if (!path.length) return;
  walking = true;

  const step = path.shift();
  gridX = step.x;
  gridY = step.y;
  updatePlayer();

  setTimeout(() => {
    walking = false;
    walkPath(path);
  }, 220);
}

// ================= CLICK =================
floor.addEventListener("click", e => {
  if (walking) return;

  const r = floor.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  const isoX = mx / (ISO_W / 2);
  const isoY = my / (ISO_H / 2);

  const x = Math.floor((isoY + isoX) / 2);
  const y = Math.floor((isoY - isoX) / 2);

  if (
    x >= 0 && x < COLS &&
    y >= 0 && y < ROWS &&
    !blocked[y][x]
  ) {
    const path = findPath(gridX, gridY, x, y);
    walkPath(path);
  }
});

// ================= INIT =================
drawFurni();
updatePlayer();
