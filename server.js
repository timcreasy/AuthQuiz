const express = require('express');
const app = express();
const connectDatabase = require('./db/database');
const bodyParser = require('body-parser');

// Config
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('An error occured!');
});

connectDatabase
  .then(() => {
    app.listen(8080, () => {
      console.log("Server listening on port 8080...");
    })
  })
  .catch((err) => {
    console.log(err);
  })