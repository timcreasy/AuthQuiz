const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/authquiz';

mongoose.promise = Promise;

module.exports = mongoose.connect(MONGODB_URL);