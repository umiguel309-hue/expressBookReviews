const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => user.username === username);
    return userswithsamename.length > 0;
  }

  const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => user.username === username && user.password === password);
    return validusers.length > 0;
  }

  regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(404).json({message: "Usuario y contraseña son obligatorios"});
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(208).json({message: "Usuario o contraseña incorrectos"});
    }
  
    let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 60 * 60 });
  
    req.session.authorization = {
      accessToken, username
    };
  
    return res.status(200).json({message: "Usuario logueado exitosamente"});
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];

  if (!books[isbn]) {
    return res.status(404).json({message: "Libro no encontrado"});
  }

  if (!review) {
    return res.status(404).json({message: "Se requiere el texto de la reseña"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Reseña agregada/actualizada exitosamente", reviews: books[isbn].reviews});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if (!books[isbn]) {
    return res.status(404).json({message: "Libro no encontrado"});
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Reseña eliminada exitosamente", reviews: books[isbn].reviews});
  } else {
    return res.status(404).json({message: "No se encontró una reseña tuya para este libro"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
