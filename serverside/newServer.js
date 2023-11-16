const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3500;
const app = express();
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const errorHandler = require('./middleware/errorHandler');

// custom logger
app.use(logger);

// cross origin resource sharing
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
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.send({ error: '404 Not found' });
  } else {
    res.type('text').send('404 Not found');
  }
});

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
