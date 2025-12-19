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

  // Nascondi creazione PG, mostra HUD
  document.getElementById('createPGDiv').style.display = 'none';
  document.getElementById('welcomeDiv').style.display = 'block';

  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
  document.getElementById('studentName').textContent = currentStudent;
  document.getElementById('avatar').textContent = currentAvatar;
}

