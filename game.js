let currentStudent = '';
let currentAvatar = '';

// Selezione avatar
function selectAvatar(avatar, type) {
  if(type === 'register') {
    currentAvatar = avatar;
    alert(`Avatar selezionato: ${avatar}`);
  }
}

// Mostra login
function showLogin() {
  document.getElementById('registerDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
}

// Mostra registrazione
function showRegister() {
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('registerDiv').style.display = 'block';
}

// Registrazione
function register() {
  const username = document.getElementById('regUsername').value.trim();
  if(username === '' || currentAvatar === '') {
    alert('Inserisci un nome e scegli un avatar!');
    return;
  }

  // Salva nel localStorage
  const player = {name: username, avatar: currentAvatar};
  localStorage.setItem(username, JSON.stringify(player));
  alert('Registrazione completata! Ora puoi fare il login.');
  showLogin();
}

// Login
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  if(username === '') {
    alert('Inserisci il tuo nome!');
    return;
  }

  const playerData = localStorage.getItem(username);
  if(!playerData) {
    alert('Utente non trovato! Registrati prima.');
    return;
  }

  const player = JSON.parse(playerData);
  currentStudent = player.name;
  currentAvatar = player.avatar;

  // Nascondi login, mostra HUD
  document.getElementById('loginDiv').style.display = 'none';
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

// Cambia avatar (solo HUD)
function changeAvatar() {
  const avatarDiv = document.getElementById('avatar');
  const avatars = ['🧙‍♂️','🧙‍♀️','🧝‍♂️','🧝‍♀️','🧞‍♂️'];
  avatarDiv.textContent = avatars[Math.floor(Math.random() * avatars.length)];
}
