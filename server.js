const express = require('express');
const app = express();

// SERVE LA CARTELLA PUBLIC
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server avviato');
});
