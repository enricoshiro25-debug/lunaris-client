const username = localStorage.getItem("username");
if (!username) window.location.href = "login.html";

// carica avatar salvato
const avatar = JSON.parse(
  localStorage.getItem("avatar_" + username)
);

const faces = ["face1.png","face2.png","face3.png"];
const robes = ["robe1.png","robe2.png","robe3.png"];

document.getElementById("face").src =
  "/images/avatars/face/" + faces[avatar?.face ?? 0];

document.getElementById("robe").src =
  "/images/avatars/robe/" + robes[avatar?.robe ?? 0];

const player = document.getElementById("player");
const room = document.getElementById("room");

// posizione iniziale
let x = 280;
let y = 300;
player.style.left = x + "px";
player.style.top = y + "px";

// movimento con click
room.addEventListener("click", e => {
  const rect = room.getBoundingClientRect();
  x = e.clientX - rect.left - 40;
  y = e.clientY - rect.top - 70;

  player.style.left = x + "px";
  player.style.top = y + "px";
});
