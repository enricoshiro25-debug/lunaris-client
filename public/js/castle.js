console.log("CASTLE JS 11.1 CARICATO");

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

// =========================
// ISO → SCHERMO
// =========================
function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_W / 2) + window.innerWidth / 2,
    y: (x + y) * (TILE_H / 2) + 150
  };
}

// =========================
// AVATAR
// =========================
function updateAvatar() {
  sprite.src = `images/avatars/robe/${player.direction}/${player.robe}.png`;
}

// =========================
// POSIZIONE
// =========================
function updatePosition() {
  const pos = isoToScreen(player.tileX, player.tileY);
  playerEl.style.left = pos.x + "px";
  playerEl.style.top = pos.y + "px";
}

// =========================
// INIT
// =========================
updateAvatar();
updatePosition();

// =========================
// CLICK → SOLO DIREZIONE
// =========================
document.addEventListener("click", e => {
  const dx = e.clientX - window.innerWidth / 2;
  const dy = e.clientY - 150;

  // confronto diretto (come Habbo)
  if (Math.abs(dx) > Math.abs(dy)) {
    player.direction = dx > 0 ? "e" : "w";
  } else {
    player.direction = dy > 0 ? "s" : "n";
  }

  updateAvatar();
});
