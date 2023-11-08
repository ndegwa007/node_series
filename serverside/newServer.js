const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3500;
const app = express();
const { logger } = require('./middleware/logEvents');
const cors = require('cors');

// custom logger
app.use(logger);

// cross origin resource sharing
app.use(cors());

/**
 * built-in middleware for encoded url
 * in other words form data
 * content-type: application/x-www-form-urlencoded
 */
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// redirect
app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html');
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
