const express = require('express');
const app = express();
const connectDatabase = require('./db/database');
const bodyParser = require('body-parser');
const User = require('./models/user');

// Config
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  User
    .create({email: req.body.email, password: req.body.password})
    .then((user) => {
      res.redirect('/login');
    })
    .catch((err) => {
      next(err);
    });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
    User
    .findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        res.redirect('/login');
      } else {
        return new Promise((resolve, reject) => {
          bcrypt.compare(req.body.password, user.password, (err, matches) => {
            if (err) {
              reject(err);
            } else {
              resolve(matches)
            }
          });
        });
      }
    })
    .then((matches) => {
      if (!matches) {
        res.redirect('/login');
      } else {
        req.session.email = req.body.email;
        res.redirect('/');
      }
    })
});

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