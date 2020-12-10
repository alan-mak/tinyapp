const { assert } = require('chai');
const { urlDatabase } = require('../data.js');

const { getUserByEmail, generateRandomString, urlsForUser, loginUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
  it('should return undefined for non-existant email', function() {
    const user = getUserByEmail("alan@example.com", testUsers);
    const expectedOutput = undefined;
    assert.isUndefined(user, expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should return 6 character string', function() {
    const user = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(user, expectedOutput);
  });
  it('should return two different values', function() {
    const user1 = generateRandomString();
    const user2 = generateRandomString();
    assert.notEqual(user1, user2);
  });
});

describe('urlsForUser', function() {
  it('should return an object', function() {
    const user = urlsForUser(testUsers.user2RandomID);
    assert.isObject(user);
  });
  it('is the returned short and long url links', function() {
    const user = urlsForUser('userRandomID');
    assert.deepInclude(user, urlDatabase);
  });
});

describe('loginUser', function() {
  it('should return undefined if user is not registered', function() {
    const user = loginUser(urlDatabase, "alan@test.com", "123");
    assert.isUndefined(user);
  });
  // Due to bcrypt the entered password would be hashed so a registered user could not be tested however, it can be visually compared between the database and entered password when console log is used within the function
});