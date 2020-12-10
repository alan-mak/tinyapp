const bcrypt = require('bcrypt');
const {urlDatabase} = require('./data');

// Checks Email and Password in database
const loginUser = function(users, email, password) {
  for (let key in users) {
    if ((users[key].email === email) && (bcrypt.compareSync(password, users[key].password))) {
      return users[key];
    }
  }
};

// Email Checker for object
let getUserByEmail = function(email, database) {
  for (let randomIDKey in database) {
    if (database[randomIDKey].email === email) {
      return database[randomIDKey];
    }
  }
  return undefined;
};

// Returns URL where the userID is equal to the current logged in user
let urlsForUser = function(id) {
  let userURL = {};
  for (let key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      userURL[key] = urlDatabase[key];
    }
  }
  return userURL;
};

// Generates a string of 6 random alphanumeric characters
let generateRandomString = () => Math.random().toString(36).substring(2, 8);

module.exports = {
  urlsForUser,
  getUserByEmail,
  loginUser,
  generateRandomString
};