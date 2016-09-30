const express = require('express');
const app = express();
const connectDatabase = require('./db/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const RedisStore = require('connect-redis')(session);
const User = require('./models/user');

// Config
const PORT = process.env.PORT || 8080;
app.set('port', PORT);
app.set('view engine', 'pug');

app.locals.email = "";

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'timssupersecretkey'
}));
app.use((req, res, next) => {
  if (req.session.email) {
    app.locals.email = req.session.email
  } else {
    app.locals.email = null;
  }
  next()
});

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
            reject(err)
          } else {
            resolve(matches)
          }
        })
      })
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

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) { throw err }
    res.redirect('/login');
  })
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('An error occured!');
});

connectDatabase
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    })
  })
  .catch((err) => {
    console.log(err);
  })