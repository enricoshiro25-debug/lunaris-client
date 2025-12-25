const player = document.getElementById("player");
const map = document.getElementById("map");

let px = 300;
let py = 220;
let speed = 4;

map.addEventListener("click", (e) => {
  const rect = map.getBoundingClientRect();
  const targetX = e.clientX - rect.left;
  const targetY = e.clientY - rect.top;

  const dx = targetX - px;
  const dy = targetY - py;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) player.src = "/images/avatars/robe/e/robe1.png";
    else player.src = "/images/avatars/robe/w/robe1.png";
  } else {
    if (dy > 0) player.src = "/images/avatars/robe/s/robe1.png";
    else player.src = "/images/avatars/robe/n/robe1.png";
  }

  const move = setInterval(() => {
    if (Math.abs(px - targetX) < speed && Math.abs(py - targetY) < speed) {
      clearInterval(move);
      return;
    }

    px += Math.sign(dx) * speed;
    py += Math.sign(dy) * speed;

    player.style.left = px + "px";
    player.style.top = py + "px";
  }, 16);
});
