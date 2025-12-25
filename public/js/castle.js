const player = document.getElementById("player");
const map = document.getElementById("map");

let px = 300;
let py = 260;
let tx = px;
let ty = py;

let direction = "s";
let frame = 0;
let moving = false;

const speed = 2;
const frameDelay = 12;
let frameCounter = 0;

player.style.left = px + "px";
player.style.top = py + "px";

map.addEventListener("click", (e) => {
  const rect = map.getBoundingClientRect();
  tx = e.clientX - rect.left - 24;
  ty = e.clientY - rect.top - 48;

  const dx = tx - px;
  const dy = ty - py;

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? "e" : "w";
  } else {
    direction = dy > 0 ? "s" : "n";
  }

  moving = true;
});

function update() {
  let moved = false;

  if (Math.abs(px - tx) > speed) {
    px += Math.sign(tx - px) * speed;
    moved = true;
  }
  if (Math.abs(py - ty) > speed) {
    py += Math.sign(ty - py) * speed;
    moved = true;
  }

  if (!moved) {
    moving = false;
    frame = 0;
  }

  frameCounter++;
  if (moving && frameCounter > frameDelay) {
    frame = frame === 0 ? 1 : 0;
    frameCounter = 0;
  }

  player.src = `/images/avatars/robe/${direction}/robe1_${frame}.png`;

  player.style.left = px + "px";
  player.style.top = py + "px";

  requestAnimationFrame(update);
}

update();
