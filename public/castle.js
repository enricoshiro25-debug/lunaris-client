const TILE_W = 48;
const TILE_H = 24;

const player = {
  tileX: 5,
  tileY: 5,
  direction: "s",
  robe: "robe1"
};

const playerEl = document.getElementById("player");
const sprite = document.getElementById("playerSprite");

// ISO → SCHERMO
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + window.innerWidth / 2,
    y: (x + y) * (TILE_H / 2) + 150
  };
}

// === AVATAR (ADATTATO ALLE TUE CARTELLE) ===
function updateAvatar() {
  sprite.src =
    `/images/avatars/robe/${player.direction}/${player.robe}.png`;
}

// POSIZIONE
function updatePosition() {
  const pos = isoToScreen(player.tileX, player.tileY);
  playerEl.style.left = pos.x + "px";
  playerEl.style.top = pos.y + "px";
}

// INIT
updateAvatar();
updatePosition();

// CLICK MOVIMENTO
document.addEventListener("click", e => {
  const dx = e.clientX - window.innerWidth / 2;
  const dy = e.clientY - 150;

  const tileX = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2);
  const tileY = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);

  const diffX = tileX - player.tileX;
  const diffY = tileY - player.tileY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    player.direction = diffX > 0 ? "e" : "w";
  } else {
    player.direction = diffY > 0 ? "s" : "n";
  }

  player.tileX = tileX;
  player.tileY = tileY;

  updateAvatar();
  updatePosition();
});
