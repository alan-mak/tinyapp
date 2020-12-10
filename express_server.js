const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

// Store and access users in an app
const users = {
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

// Generates a string of 6 random alphanumeric characters
let generateRandomString = () => Math.random().toString(36).substring(2, 8);

// Checks Email and Password in database
const loginUser = function (users, email, password) {
  for (let key in users) {
    if ((users[key].email === email) && (users[key].password === password)) {
      return users[key]
    }
  }
  
}

// Email Checker for object
let emailChecker = function (obj, email) {
  for (let randomIDKey of Object.keys(obj)) {
    if (obj[randomIDKey].email === email) {
      return true;
    }
  }
  return false;
};

// Returns URL where the userID is equal to the current logged in user
let urlsForUser = function(id) {
  let userURL = {};
  for (let key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      userURL[key] = urlDatabase[key]
    }
  }
  return userURL;
}

// Main Page redirection
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => res.json(urlDatabase));

// Adding a route handler to pass the URL to template
app.get("/urls", (req, res) => {
  let userID = req.cookies.user_id;
  if (!userID) {
    return res.redirect('/register');
  }
  let userURLS = urlsForUser(userID);
  const templateVars = {
    urls: userURLS,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

// Route to register
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  // Checks if email and password was given
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.send("<h1>400 BAD REQUEST</h1>");
  } else if (emailChecker(users, req.body.email)) { // Checks if the email has been used before
    res.statusCode = 400;
    res.send("<h1>400 BAD REQUEST</h1>");
  } else {
    let randomID = generateRandomString();
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: req.body.password
    }
    res.cookie("user_id", randomID);
    res.redirect("/urls");
  }
})

// Adding a route to new URL
app.get("/urls/new", (req, res) => {
// Logic for login
let userID = req.cookies.user_id;
  if (!userID) {
    res.redirect('/register');
  } else {
    const templateVars = {
      urls: urlDatabase.longURL,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
  }
});

// Adding a route for long url to short url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

// Route to log request
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  }
  //Now we redirect to the index
  res.redirect('/urls');
});

// Route to delete from database
app.post("/urls/:shortURL/delete", (req, res) => {
// Logic for login
let userID = req.cookies.user_id;
  if (!userID) {
    res.redirect("/register");
  } else {
    let key = req.params.shortURL;
    delete urlDatabase[key];
    res.redirect('/urls');
  }
});

// Route to edit
app.post("/urls/:shortURL", (req, res) => {
// Logic for login
let userID = req.cookies.user_id;
  if (!userID) {
    res.redirect("/register");
  } else {
    let key = req.params.shortURL;
    // Using the field provided in urls_show name of the text box
    let newURL = req.body.newAddress;
    urlDatabase[key] = {
      longURL: newURL,
      userID : userID
    }
    res.redirect(`/urls/${key}`);
  }
});

// Redirection to LongURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// Route to login
app.get("/login", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  // Setting a cookie for the login name
  const existingUser = loginUser(users, req.body.email, req.body.password);
  if (existingUser) {
    // set the cookie with user.id
    res.cookie("user_id", existingUser.id);
    // redirect to /urls
    res.redirect("/urls");
    return
  }
  req.statusCode = 403;
  res.send('<h1> ERROR 403 - Invalid Email Or Password </h1>')
});

// Route to logout
app.post("/logout", (req, res) => {
  // Clear cookies command by user_id
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});