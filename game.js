let currentStudent = '';
let currentAvatar = '';

// Selezione avatar
function selectAvatar(avatar, type) {
  if(type === 'register') {
    currentAvatar = avatar;
    alert(`Avatar selezionato: ${avatar}`);
  }
}

// Mostra login / registrazione
function showLogin() {
  document.getElementById('registerDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
}
function showRegister() {
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('registerDiv').style.display = 'block';
}

// Registrazione
function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  if(username === '' || currentAvatar === '' || password === '') {
    alert('Inserisci nome, password e scegli un avatar!');
    return;
  }

  // Controllo se l'utente esiste già
  if(localStorage.getItem(username)) {
    alert('Utente già registrato! Fai il login.');
    return;
  }

  // Salva in localStorage
  const player = {name: username, avatar: currentAvatar, password: password};
  localStorage.setItem(username, JSON.stringify(player));
  alert('Registrazione completata! Ora puoi fare il login.');
  showLogin();
}

// Login
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if(username === '' || password === '') {
    alert('Inserisci nome e password!');
    return;
  }

  const playerData = localStorage.getItem(username);
  if(!playerData) {
    alert('Utente non trovato! Registrati prima.');
    return;
  }

  const player = JSON.parse(playerData);

  if(player.password !== password) {
    alert('Password errata!');
    return;
  }

  currentStudent = player.name;
  currentAvatar = player.avatar;

  // Mostra HUD
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('registerDiv').style.display = 'none';
  document.getElementById('welcomeDiv').style.display = 'block';

  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
  document.getElementById('studentName').textContent = currentStudent;
  document.getElementById('avatar').textContent = currentAvatar;
}

// Vai al dormitorio
function goToDorm() {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `Sei entrato nel dormitorio di ${currentStudent} 🛏️✨`;
}

// Cambia avatar
function changeAvatar() {
  const avatarDiv = document.getElementById('avatar');
  const avatars = ['🧙‍♂️','🧙‍♀️','🧝‍♂️','🧝‍♀️','🧞‍♂️'];
  avatarDiv.textContent = avatars[Math.floor(Math.random() * avatars.length)];
}
