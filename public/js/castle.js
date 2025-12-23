console.log("CASTLE JS 11.9 CARICATO");

// =========================
// CONFIG
// =========================
const TILE_W = 48;
const TILE_H = 24;
const MOVE_SPEED = 0.12;

const MAP_COLS = 10;
const MAP_ROWS = 10;

// =========================
// MAPPA COLLISIONI
// =========================
const collisionMap = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

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
// INIT
// =========================
updateAvatar();

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

  while (queue.length) {
    const cur = queue.shift();
    if (cur.x === tx && cur.y === ty) return cur.path;

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
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;

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
// GAME LOOP + CAMERA
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

  // CAMERA: il mondo segue il player
  game.style.transform =
    `translate(${window.innerWidth / 2 - player.screenX}px,
               ${window.innerHeight / 2 - player.screenY}px)`;

  requestAnimationFrame(gameLoop);
}

gameLoop();
