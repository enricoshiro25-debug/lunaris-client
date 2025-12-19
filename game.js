let currentStudent = '';
let currentAvatar = {};

// Mostra login / registrazione
function showLogin() {
  document.getElementById('registerDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
}
function showRegister() {
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('registerDiv').style.display = 'block';
}

// Avatar builder
function updateAvatar() {
  document.getElementById('faceLayer').src = document.getElementById('faceSelect').value;
  document.getElementById('hairLayer').src = document.getElementById('hairSelect').value;
  document.getElementById('clothesLayer').src = document.getElementById('clothesSelect').value;
  document.getElementById('accessoryLayer').src = document.getElementById('accessorySelect').value;
}

// Registrazione
function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  if(username === '' || password === '') {
    alert('Inserisci nome, password e scegli un avatar!');
    return;
  }

  if(localStorage.getItem(username)) {
    alert('Utente già registrato! Fai il login.');
    return;
  }

  const avatar = {
    face: document.getElementById('faceSelect').value,
    hair: document.getElementById('hairSelect').value,
    clothes: document.getElementById('clothesSelect').value,
    accessory: document.getElementById('accessorySelect').value
  };

  localStorage.setItem(username, JSON.stringify({password, avatar}));
  alert('Registrazione completata! Ora puoi fare il login.');
  showLogin();
}

// Login
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const data = localStorage.getItem(username);
  if(!data) { alert('Utente non trovato!'); return; }

  const player = JSON.parse(data);
  if(player.password !== password) { alert('Password errata!'); return; }

  currentStudent = username;
  currentAvatar = player.avatar;

  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('registerDiv').style.display = 'none';
  document.getElementById('welcomeDiv').style.display = 'block';
  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
  document.getElementById('studentName').textContent = currentStudent;

  // Mostra avatar
  const avatarDiv = document.getElementById('avatar');
  avatarDiv.innerHTML = `
    <img src="${currentAvatar.face}" class="avatarImg">
    <img src="${currentAvatar.hair}" class="avatarImg">
    <img src="${currentAvatar.clothes}" class="avatarImg">
    <img src="${currentAvatar.accessory}" class="avatarImg">
  `;

  // Salva per il dormitorio
  localStorage.setItem('currentAvatarModular', JSON.stringify(currentAvatar));
}

// Vai al dormitorio
function goToDorm() {
  window.location.href = 'dormitorio.html';
}
