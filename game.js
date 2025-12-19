let currentStudent = '';

function login() {
  const username = document.getElementById('username').value.trim();
  if (username === '') {
    alert('Inserisci il tuo nome studente');
    return;
  }

  currentStudent = username;

  // Nascondi login, mostra welcome e HUD
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('welcomeDiv').style.display = 'block';

  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
  document.getElementById('studentName').textContent = currentStudent;
}

function goToDorm() {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `Sei entrato nel dormitorio di ${currentStudent} 🛏️✨`;
}

// Esempio di funzione impostazioni: cambia avatar
function changeAvatar() {
  const avatarDiv = document.getElementById('avatar');
  const avatars = ['🧙‍♂️','🧙‍♀️','🧛‍♂️','🧝‍♀️','🧞‍♂️'];
  avatarDiv.textContent = avatars[Math.floor(Math.random() * avatars.length)];
}
