const mongoose = require('mongoose');

mongoose.promise = Promise;

module.exports = mongoose.connect('mongodb://localhost/authquiz');