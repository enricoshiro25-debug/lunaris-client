const TILE_W = 64;
const TILE_H = 32;

const map = document.getElementById("map");
const player = document.createElement("img");
player.id = "player";
map.appendChild(player);

let playerPos = { x: 5, y: 5 };
let targetPos = null;
let direction = "s";
let frame = 0;
let moving = false;
let lastFrameTime = 0;

function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_W / 2,
    y: (x + y) * TILE_H / 2
  };
}

function updateSprite() {
  player.src = `/images/avatars/robe/${direction}/robe1_${frame}.png`;
}

function placePlayer() {
  const pos = isoToScreen(playerPos.x, playerPos.y);
  player.style.left = pos.x + "px";
  player.style.top = pos.y + "px";
}

function getDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "e" : "w";
  } else {
    return dy > 0 ? "s" : "n";
  }
}

function animate(timestamp) {
  if (moving && timestamp - lastFrameTime > 200) {
    frame = frame === 0 ? 1 : 0;
    updateSprite();
    lastFrameTime = timestamp;
  }

  if (targetPos) {
    const dx = targetPos.x - playerPos.x;
    const dy = targetPos.y - playerPos.y;

    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      playerPos = targetPos;
      targetPos = null;
      moving = false;
      frame = 0;
      updateSprite();
    } else {
      playerPos.x += dx * 0.1;
      playerPos.y += dy * 0.1;
    }
  }

  placePlayer();
  requestAnimationFrame(animate);
}

map.addEventListener("click", (e) => {
  const rect = map.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const isoX = (my / TILE_H + mx / TILE_W);
  const isoY = (my / TILE_H - mx / TILE_W);

  const tx = Math.round(isoX);
  const ty = Math.round(isoY);

  direction = getDirection(tx - playerPos.x, ty - playerPos.y);
  updateSprite();

  targetPos = { x: tx, y: ty };
  moving = true;
});

updateSprite();
placePlayer();
requestAnimationFrame(animate);
