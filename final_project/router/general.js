const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({message: "Se requiere usuario y contraseña"});
  }

  if (isValid(username)) {
    return res.status(404).json({message: "El usuario ya existe"});
  }

  users.push({username, password});
  return res.status(200).json({message: "Usuario registrado exitosamente"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const matchingBooks = Object.keys(books).filter((isbn) => {
    return books[isbn].author === author;
  });

  const result = matchingBooks.map((isbn) => books[isbn]);

  res.send(JSON.stringify(result, null, 4));
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const matchingBooks = Object.keys(books).filter((isbn) => {
    return books[isbn].title === title;
  });

  const result = matchingBooks.map((isbn) => books[isbn]);

  res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});


const axios = require('axios');

// Usando Promesas (.then / .catch)
public_users.getAllBooksPromise = function () {
  return axios.get('http://localhost:5000/')
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => {
      console.error("Error al obtener los libros:", error.message);
    });
};

// Usando Async/Await
public_users.getAllBooksAsync = async function () {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error.message);
  }
};


// ISBN - Usando Promesas
public_users.getBookByISBNPromise = function (isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => {
      console.error("Error al obtener el libro:", error.message);
    });
};

// ISBN - Usando Async/Await
public_users.getBookByISBNAsync = async function (isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al obtener el libro:", error.message);
  }
};

// Autor - Usando Promesas
public_users.getBooksByAuthorPromise = function (author) {
  return axios.get(`http://localhost:5000/author/${author}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => {
      console.error("Error al obtener los libros:", error.message);
    });
};

// Autor - Usando Async/Await
public_users.getBooksByAuthorAsync = async function (author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error.message);
  }
};

// Título - Usando Promesas
public_users.getBooksByTitlePromise = function (title) {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => {
      console.error("Error al obtener los libros:", error.message);
    });
};

// Título - Usando Async/Await
public_users.getBooksByTitleAsync = async function (title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(JSON.stringify(response.data, null, 4));
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error.message);
  }
};


module.exports.general = public_users;
