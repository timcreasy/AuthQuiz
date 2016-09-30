const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    match: [EMAIL_VALIDATION, 'Invalid email format'],
    unique: [true, 'Email is already registered']
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Before saving new user, hash password
userSchema.pre('save', function(done) {
  // Hash password prior to save
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) { return done(err) }
    this.password = hash;
    done();
  });
});


module.exports = User;