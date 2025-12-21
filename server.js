const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// finto database (per ora)
const users = [];

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
  console.log("Utenti:", users);

  res.send("Registrazione completata!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server avviato");
});
