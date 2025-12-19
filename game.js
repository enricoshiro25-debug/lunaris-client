let currentStudent = '';

function login() {
  const username = document.getElementById('username').value.trim();
  if (username === '') {
    alert('Inserisci il tuo nome studente');
    return;
  }

  currentStudent = username;

  // Nascondi login e mostra pulsante dormitorio
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('dormButtonDiv').style.display = 'block';

  document.getElementById('welcomeMessage').textContent = `Benvenuto ${currentStudent}!`;
}

function goToDorm() {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = `Sei entrato nel dormitorio di ${currentStudent} 🛏️✨`;
}
