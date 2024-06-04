const express = require('express');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const app = express();

const PORT = 5000;

app.use(bodyParser.json()); // Moved before routes

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  console.log('[GET ROUTE]');
  res.send('HELLO FROM HOMEPAGE');
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
module.exports = app;
