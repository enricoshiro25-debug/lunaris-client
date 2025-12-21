const express = require("express");
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());

// database temporaneo
const users = [];

// REGISTRAZIONE
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

// TEST ROUTE (IMPORTANTE)
app.get("/test", (req, res) => {
  res.send("Server OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});
