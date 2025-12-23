console.log("CASTLE JS FASE 12 CARICATO");

// =========================
// CONFIGURAZIONE BASE
// =========================
const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.12;

const MAP_COLS = 10;
const MAP_ROWS = 10;

// =========================
// PLAYER
// =========================
const player = {
  tileX: 4,
  tileY: 4,
  screenX: 0,
  screenY: 0,
  direction: "s",
  robe: "robe1",
  path: []
};

const game = document.getElementById("game");
const playerEl = document.getElementById("player");
const sprite = document.getElementById("playerSprite");

// =========================
// FURNI (I TUOI)
// =========================
const furniList = [
  { id: 1, x: 4, y: 2, img: "bookshelf.png", solid: true },
  { id: 2, x: 6, y: 4, img: "table.png", solid: true },
  { id: 3, x: 3, y: 6, img: "chest.png", solid: true }
];

// =========================
// MAPPA COLLISIONI
// =========================
const collisionMap = Array.from({ length: MAP_ROWS }, () =>
  Array(MAP_COLS).fill(0)
);

// blocca le tile dei furni
furniList.forEach(f => {
  if (f.solid) collisionMap[f.y][f.x] = 1;
});

// =========================
// ISO → SCHERMO
// =========================
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2)
  };
}

// =========================
// AVATAR
// =========================
function updateAvatar() {
  sprite.src = `images/avatars/robe/${player.direction}/${player.robe}.png`;
}

// =========================
// CREA FURNI
// =========================
function createFurni() {
  furniList.forEach(f => {
    const el = document.createElement("img");
    const pos = isoToScreen(f.x, f.y);

    el.src = `images/furni/${f.img}`;
    el.style.position = "absolute";
    el.style.left = pos.x + "px";
    el.style.top = pos.y + "px";
    el.style.transform = "translate(-50%, -80%)";
    el.style.pointerEvents = "none";
    el.style.imageRendering = "pixelated";
    el.style.zIndex = f.y * 10;

    game.appendChild(el);
  });
}

// =========================
// INIT
// =========================
updateAvatar();
createFurni();

// =========================
// PATHFINDING (BFS)
// =========================
function findPath(sx, sy, tx, ty) {
  const queue = [{ x: sx, y: sy, path: [] }];
  const visited = Array.from({ length: MAP_ROWS }, () =>
    Array(MAP_COLS).fill(false)
  );

  visited[sy][sx] = true;

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  while (queue.length > 0) {
    const cur = queue.shift();

    if (cur.x === tx && cur.y === ty) {
      return cur.path;
    }

    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;

      if (
        nx >= 0 && ny >= 0 &&
        nx < MAP_COLS && ny < MAP_ROWS &&
        !visited[ny][nx] &&
        collisionMap[ny][nx] === 0
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

  return null;
}

// =========================
// CLICK
// =========================
document.addEventListener("click", e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  const tx = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const ty = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

  if (
    tx < 0 || ty < 0 ||
    tx >= MAP_COLS || ty >= MAP_ROWS ||
    collisionMap[ty][tx] === 1
  ) return;

  const path = findPath(player.tileX, player.tileY, tx, ty);
  if (path) player.path = path;
});

// =========================
// GAME LOOP
// =========================
function gameLoop() {
  if (player.path.length > 0) {
    const next = player.path[0];
    const target = isoToScreen(next.x, next.y);

    const dx = target.x - player.screenX;
    const dy = target.y - player.screenY;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      player.tileX = next.x;
      player.tileY = next.y;
      player.screenX = target.x;
      player.screenY = target.y;
      player.path.shift();
    } else {
      player.screenX += dx * MOVE_SPEED;
      player.screenY += dy * MOVE_SPEED;
    }

    const diffX = next.x - player.tileX;
    const diffY = next.y - player.tileY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      player.direction = diffX > 0 ? "e" : "w";
    } else {
      player.direction = diffY > 0 ? "s" : "n";
    }

    updateAvatar();
  }

  // CAMERA CENTRATA
  game.style.transform =
    `translate(${window.innerWidth / 2 - player.screenX}px,
               ${window.innerHeight / 2 - player.screenY}px)`;

  playerEl.style.zIndex = player.tileY * 10;

  requestAnimationFrame(gameLoop);
}

gameLoop();
