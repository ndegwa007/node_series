const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3500;
const app = express();
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// custom logger
app.use(logger);

// cross origin resource sharing
const whitelist = ['http://www.yoursite.com', 'http://127:0.0.1:5000', 'https://www.google.com'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  originSuccessStatus: 200

};
app.use(cors(corsOptions));

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

app.all('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
