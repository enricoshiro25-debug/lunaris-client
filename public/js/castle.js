const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ------------------ CONFIG ------------------
const TILE_W = 64;
const TILE_H = 32;
const GRID_W = 12;
const GRID_H = 12;

let cameraX = canvas.width / 2;
let cameraY = 200;

// ------------------ PLAYER ------------------
const player = {
  x: 6,
  y: 6,
  px: 6,
  py: 6,
  dir: "s",
  frame: 0,
  moving: false
};

// ------------------ LOAD IMAGES ------------------
const playerImgs = {};
["n","s","e","w"].forEach(d => {
  playerImgs[d] = [
    new Image(),
    new Image()
  ];
  playerImgs[d][0].src = `/images/avatars/robe/${d}/robe1_0.png`;
  playerImgs[d][1].src = `/images/avatars/robe/${d}/robe1_1.png`;
});

const furni = [
  { img: loadImg("/images/furni/bookshelf.png"), x: 4, y: 4, scale: 0.8 },
  { img: loadImg("/images/furni/chest.png"), x: 6, y: 5, scale: 0.8 },
  { img: loadImg("/images/furni/table.png"), x: 7, y: 4, scale: 0.8 }
];

function loadImg(src){
  const i = new Image();
  i.src = src;
  return i;
}

// ------------------ ISO ------------------
function iso(x, y){
  return {
    x: (x - y) * TILE_W / 2 + cameraX,
    y: (x + y) * TILE_H / 2 + cameraY
  };
}

// ------------------ CLICK ------------------
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - cameraX;
  const my = e.clientY - rect.top - cameraY;

  const tx = Math.floor((my / (TILE_H/2) + mx / (TILE_W/2)) / 2);
  const ty = Math.floor((my / (TILE_H/2) - mx / (TILE_W/2)) / 2);

  if(tx >= 0 && ty >= 0 && tx < GRID_W && ty < GRID_H){
    player.px = tx;
    player.py = ty;

    if(tx > player.x) player.dir = "e";
    else if(tx < player.x) player.dir = "w";
    else if(ty > player.y) player.dir = "s";
    else if(ty < player.y) player.dir = "n";

    player.moving = true;
  }
});

// ------------------ UPDATE ------------------
function update(){
  if(player.moving){
    if(player.x < player.px) player.x += 0.08;
    if(player.x > player.px) player.x -= 0.08;
    if(player.y < player.py) player.y += 0.08;
    if(player.y > player.py) player.y -= 0.08;

    player.frame += 0.15;

    if(Math.abs(player.x - player.px) < 0.05 &&
       Math.abs(player.y - player.py) < 0.05){
      player.x = player.px;
      player.y = player.py;
      player.moving = false;
      player.frame = 0;
    }
  }
}

// ------------------ DRAW ------------------
function drawGrid(){
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for(let x=0;x<GRID_W;x++){
    for(let y=0;y<GRID_H;y++){
      const p = iso(x,y);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + TILE_W/2, p.y + TILE_H/2);
      ctx.lineTo(p.x, p.y + TILE_H);
      ctx.lineTo(p.x - TILE_W/2, p.y + TILE_H/2);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawGrid();

  // furni
  furni.forEach(f => {
    const p = iso(f.x, f.y);
    const w = f.img.width * f.scale;
    const h = f.img.height * f.scale;
    ctx.drawImage(f.img, p.x - w/2, p.y - h + TILE_H, w, h);
  });

  // player
  const p = iso(player.x, player.y);
  const img = playerImgs[player.dir][Math.floor(player.frame)%2];
  ctx.drawImage(img, p.x - img.width/2, p.y - img.height + TILE_H);
}

// ------------------ LOOP ------------------
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
