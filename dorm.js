window.addEventListener('load', () => {
  const avatar = JSON.parse(localStorage.getItem('currentAvatarModular'));
  const playerImg = document.getElementById('playerAvatar');

  if(avatar) {
    playerImg.src = avatar.face; // per ora mostriamo il layer face, puoi sovrapporre gli altri layer con <img> multipli
    playerImg.dataset.hair = avatar.hair;
    playerImg.dataset.clothes = avatar.clothes;
    playerImg.dataset.accessory = avatar.accessory;
  }

  let x=100,y=100;
  playerImg.style.position='absolute';
  playerImg.style.left=x+'px';
  playerImg.style.top=y+'px';

  document.addEventListener('keydown',(e)=>{
    const step=10;
    switch(e.key){
      case 'ArrowUp': y-=step; break;
      case 'ArrowDown': y+=step; break;
      case 'ArrowLeft': x-=step; break;
      case 'ArrowRight': x+=step; break;
    }
    playerImg.style.left=x+'px';
    playerImg.style.top=y+'px';
  });
});
