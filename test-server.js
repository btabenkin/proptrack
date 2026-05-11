const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Rental Property API is running - Basic Test');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});