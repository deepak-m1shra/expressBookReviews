const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function userExists(username) {
  let getUsers = users.filter((user) => user.username == username)
  return getUsers.length > 0
}

public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.send({ message: "Invalid or missing username/password" })
  }

  if (!userExists(username)) {
    // add user to list of users
    users.push({ "username": username, "password": password })
    console.log(users)
    return res.status(200).json({ message: "User registered successfully" });
  }
  return res.status(409).json({ message: `User with username ${username} already exists` })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ "books": books })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  let bookDetails = books[isbn]
  if (bookDetails) {
    return res.send(bookDetails);
  }
  return res.status(404).json({ message: "Book with given ISBN not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksByAuthor = []
  const author = req.params.author

  for (const b in books) {
    const book = books[b]
    if (book.author == author) {
      booksByAuthor.push(book)
    }
  }
  return res.status(200).json({ "booksbyauthor": booksByAuthor })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const bookTitle = req.params.title
  let titles = []
  for (const bt in books) {
    const book = books[bt]
    if (book.title == bookTitle) {
      titles.push(book)
    }
  }
  return res.status(200).json({ "booksbytitle": titles })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const bookWithIsbn = books[isbn]
  if (bookWithIsbn)
    return res.send(bookWithIsbn.reviews);
  return res.send([])
});

module.exports.general = public_users;
