const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const methodOverride = require('method-override');
const { urlsForUser, getUserByEmail, loginUser, generateRandomString } = require("./helpers");
const { urlDatabase, users } = require("./data");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");

/* ------------------------------------------------------------------------------ */
// Main Page redirection
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Adding a route handler to pass the URL to template
app.get("/urls", (req, res) => {
  // User Login Logic
  let userID = req.session["user_id"];
  if (!userID) {
    return res.redirect('/register');
  }
  // Finds all the urls that the user has created
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
    user: users[req.session["user_id"]]
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  // Checks if email or password was given and if email has been used before
  if (!req.body.email || !req.body.password || getUserByEmail(req.body.email, users)) {
    res.statusCode = 400;
    res.send("<h1>400 - BAD REQUEST</h1>");
  } else {
    // Registers new user
    let randomID = generateRandomString();
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds)
    };
    req.session["user_id"] = randomID;
    res.redirect("/urls");
  }
});

// Adding a route to new URL
app.get("/urls/new", (req, res) => {
  // Logic for login
  let userID = req.session["user_id"];
  if (!userID) {
    res.redirect('/register');
  } else {
    const templateVars = {
      urls: urlDatabase.longURL,
      user: users[req.session["user_id"]]
    };
    res.render("urls_new", templateVars);
  }
});

// Adding a route form short url to long url
app.get("/urls/:shortURL", (req, res) => {
  // Login Logic
  let userID = req.session["user_id"];
  if (!userID) {
    res.redirect('/register');
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session["user_id"]]
    };
    res.render("urls_show", templateVars);
  }
});

// Route to log request
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = {
    longURL: req.body.longURL,
    userID: req.session["user_id"]
  };
  //Now we redirect to the index
  res.redirect("/urls");
});

// Route to delete from database
app.delete("/urls/:shortURL/delete", (req, res) => {
  // Logic for login
  let userID = req.session["user_id"];
  if (!userID) {
    res.redirect("/register");
  } else {
    let key = req.params.shortURL;
    delete urlDatabase[key];
    res.redirect("/urls");
  }
});

// Route to edit
app.put("/urls/:shortURL", (req, res) => {
  // Logic for login
  let userID = req.session["user_id"];
  if (!userID) {
    res.redirect("/register");
  } else {
    let key = req.params.shortURL;
    // Using the field provided in urls_show name of the text box
    let newURL = req.body.newAddress;
    urlDatabase[key] = {
      longURL: newURL,
      userID: userID
    };
    res.redirect(`/urls/${key}`);
  }
});

// Redirection to LongURL even if not logged in
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// Route to login
app.get("/login", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session["user_id"]]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  // Setting a cookie for the login name
  const existingUser = loginUser(users, req.body.email, req.body.password);
  if (existingUser) {
    // set the cookie with user.id
    req.session["user_id"] = existingUser.id;
    // redirect to /urls
    res.redirect("/urls");
    return;
  }
  //If user does not exist
  res.statusCode = 403;
  res.send("<h1> ERROR 403 - INVALID EMAIL OR PASSWORD </h1>");
});

// Route to logout
app.post("/logout", (req, res) => {
  // Clear cookies command
  req.session = null;
  res.redirect("/urls");
});

/* ------------------------------------------------------------------------------ */

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});