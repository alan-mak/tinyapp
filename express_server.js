const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Generates a string of 6 random alphanumeric characters
let generateRandomString = () => Math.random().toString(36).substring(2, 8);


// Main Page says hello
app.get("/", (req, res) => {
  res.send("Hello! Welcome to Alan's TinyAPP");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Adding a route handler to pass the URL to template
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Adding a route to show a form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Adding a route for long url to short url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Route to log request
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;

  //Now we redirect to the index
  res.redirect('/urls');
});

// Route to delete from database
app.post("/urls/:shortURL/delete", (req, res) => {
  let key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect('/urls');
})

// Route to edit
app.post("/urls/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  // Using the field provided in urls_show name of the text box
  let newURL = req.body.newAddress;
  urlDatabase[key] = newURL;
  res.redirect(`/urls/${key}`)
})

// Redirection to LongURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});