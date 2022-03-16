const express = require("express"); //imports express framework 
const app = express(); //Declares a variable that encapsulates express's functionality 

//Get Requests 
app.get('/', (req, res) => {
  res.send('Welcome to myMovie website! ')
});

//Reads the documentation
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

//Will return info containing data about top 10 movies 
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//Static files to serve documentation.html file from public folder 
app.use(express.static('public'));