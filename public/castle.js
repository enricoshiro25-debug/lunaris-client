const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// ===== AVATAR =====
const avatar = JSON.parse(
  localStorage.getItem("avatar_" + username)
);

const faces = ["face1.png","face2.png","face3.png"];
const robes = ["robe1.png","robe2.png","robe3.png"];

document.getElementById("face").src =
  "/images/avatars/face/" + faces[avatar?.face ?? 0];

document.getElementById("robe").src =
  "/images/avatars/robe/" + robes[avatar?.robe ?? 0];

// ===== GRIGLIA =====
const TILE = 40;
const room = document.getElementById("room");
const player = document.getElementById("player");

// posizione in griglia
let gridX = 7;
let gridY = 6;

function updatePlayerPosition() {
  player.style.left = gridX * TILE + "px";
  player.style.top = gridY * TILE - 60 + "px";
}

// click su una casella
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  gridX = Math.floor(x / TILE);
  gridY = Math.floor(y / TILE);

  updatePlayerPosition();
});

// iniziale
updatePlayerPosition();
