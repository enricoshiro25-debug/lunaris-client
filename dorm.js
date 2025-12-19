const player = document.getElementById('player');
let x = 100;
let y = 100;

player.style.position = 'absolute';
player.style.left = x + 'px';
player.style.top = y + 'px';

document.addEventListener('keydown', (e) => {
  const step = 10;
  switch(e.key) {
    case 'ArrowUp': y -= step; break;
    case 'ArrowDown': y += step; break;
    case 'ArrowLeft': x -= step; break;
    case 'ArrowRight': x += step; break;
  }
  player.style.left = x + 'px';
  player.style.top = y + 'px';
});

function interact(objectName) {
  const message = document.getElementById('message');
  message.textContent = `Stai interagendo con: ${objectName}`;
}
