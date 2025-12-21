const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.json());

// ======================
// FILE DATABASE
// ======================
const DATA_FILE = path.join(__dirname, "users.json");

// utility: leggi utenti
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// utility: salva utenti
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// ======================
// REGISTRAZIONE
// ======================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Compila tutti i campi");
  }

  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).send("Utente già esistente");
  }

  users.push({
    username,
    password,
    avatar: { face: 0, robe: 0 }
  });

  saveUsers(users);

  res.send("Registrazione completata!");
});

// ======================
// LOGIN
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send("Credenziali non valide");
  }

  res.send("Login effettuato!");
});

// ======================
// TEST
// ======================
app.get("/test", (req, res) => {
  res.send("Server OK");
});

// ======================
// START
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
