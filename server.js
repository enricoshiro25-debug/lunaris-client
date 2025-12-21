const express = require("express");
const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.static("public"));
app.use(express.json());

// ======================
// DATABASE TEMPORANEO
// ======================
const users = [];

// ======================
// REGISTRAZIONE
// ======================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Compila tutti i campi");
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).send("Utente già esistente");
  }

  users.push({ username, password });
  console.log("Utenti registrati:", users);

  res.send("Registrazione completata!");
});

// ======================
// LOGIN
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send("Credenziali non valide");
  }

  res.send("Login effettuato!");
});

// ======================
// TEST SERVER
// ======================
app.get("/test", (req, res) => {
  res.send("Server OK");
});

// ======================
// AVVIO SERVER
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
