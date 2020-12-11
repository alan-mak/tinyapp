# Alan's TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (similar to  bit.ly, tinyurl.com, ow.ly).

### Why Do We Need URL Shortners?
* Character limitations on social media posts
  * We wouldn't wanna spend 50% of our allowed characters on just a link
* They allow for people to remember links easier
  * 8 letters would be a lot easier to remember than 30

## Product Features
* Registered users have their own library of shortened links
* Registered and logged in users are able to edit and delete their own links
  * Anyone is able to click on the shortened link
* All shortened links are selectable and will redirect to to the long URL
* Users are able to see their emails when logged in

## Final Product

A simple user friendly home page to shorten the longest of URLs
!["Main URL Page"](https://github.com/alan-mak/tinyapp/blob/master/docs/urls-page.png)


Registered user's are able to have their own library of shortened links to share
!["Different User's Different Link"](https://github.com/alan-mak/tinyapp/blob/master/docs/different-users.png)


Registered user's are able to reuse their shortened URL by providing a new URL
!["Edit Page"]()
## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

### Version 1.0