let currentStudent = '';
let currentAvatar = '';

function selectAvatar(avatar) {
  currentAvatar = avatar;
  alert(`Avatar selezionato: ${avatar}`);
}

function createPG() {
  const username = document.getElementById('newUsername').value.trim();
  if(username === '' || currentAvatar === '') {
    alert('Inserisci nome e scegli un avatar!');
    return;
  }

  currentStudent = username;

  // Nascondi creazione PG, mostra welcome e HUD
  document.getElementById('createPGDiv').style.display = 'none';
  document.getElementById('welcomeDiv').style.display = 'block';

  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
  document.getElementById('studentName').textContent = currentStudent;
  document.getElementById('avatar').textContent = currentAvatar;
}

function goToDorm() {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `Sei entrato nel dormitorio di ${currentStudent} 🛏️✨`;
}

// Funzione impostazioni: cambia avatar
function changeAvatar() {
  const avatarDiv = document.getElementById('avatar');
  const avatars = ['🧙‍♂️','🧙‍♀️','🧝‍♂️','🧝‍♀️','🧞‍♂️'];
  avatarDiv.textContent = avatars[Math.floor(Math.random() * avatars.length)];
}
