const map = document.getElementById("map");
const player = document.getElementById("player");

const TILE_W = 40;
const TILE_H = 20;

let playerTile = { x: 4, y: 4 };
let targetTile = null;
let direction = "s";

function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2)
  };
}

function screenToIso(x, y) {
  return {
    x: Math.round((x / (TILE_W / 2) + y / (TILE_H / 2)) / 2),
    y: Math.round((y / (TILE_H / 2) - x / (TILE_W / 2)) / 2)
  };
}

function updatePlayer() {
  const pos = isoToScreen(playerTile.x, playerTile.y);
  player.style.left = pos.x + map.offsetWidth / 2 + "px";
  player.style.top  = pos.y + map.offsetHeight / 2 + "px";
}

function setDirection(from, to) {
  if (to.x > from.x) direction = "e";
  else if (to.x < from.x) direction = "w";
  else if (to.y > from.y) direction = "s";
  else direction = "n";

  player.src = `/images/avatars/robe/${direction}/robe1.png`;
}

map.addEventListener("click", e => {
  const rect = map.getBoundingClientRect();
  const mx = e.clientX - rect.left - map.offsetWidth / 2;
  const my = e.clientY - rect.top - map.offsetHeight / 2;

  targetTile = screenToIso(mx, my);
  setDirection(playerTile, targetTile);
});

function step() {
  if (!targetTile) return;

  if (playerTile.x === targetTile.x && playerTile.y === targetTile.y) {
    targetTile = null;
    return;
  }

  if (playerTile.x < targetTile.x) playerTile.x++;
  else if (playerTile.x > targetTile.x) playerTile.x--;
  else if (playerTile.y < targetTile.y) playerTile.y++;
  else if (playerTile.y > targetTile.y) playerTile.y--;

  updatePlayer();
}

setInterval(step, 150);

/* POSIZIONE FURNI */
function placeFurni(id, x, y) {
  const el = document.getElementById(id);
  const p = isoToScreen(x, y);
  el.style.left = p.x + map.offsetWidth / 2 + "px";
  el.style.top  = p.y + map.offsetHeight / 2 + "px";
}

placeFurni("bookshelf", 3, 2);
placeFurni("chest", 4, 3);
placeFurni("table", 5, 2);

updatePlayer();
