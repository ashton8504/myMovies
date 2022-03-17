const express = require("express"); //imports express framework 
  app = express(); //Declares a variable that encapsulates express's functionality 
  bodyParser = require('body-parser'); //imports body parser
  uuid = require('uuid')//imports uuid
  

app.use(bodyParser.json());
  
app.use(morgan('common'))

let topMovies = [
  {
    title: 'Cool Hand Luke',
    director: 'Stuart Rosenberg'
  },
  {
    title: 'The Batman',
    director: 'Matt Reeves'
  },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    director: 'Richard Marquand'
  },
  {
    title: 'The Shining',
    director: 'Stanley Kubrick'
  },
  {
    title: 'Stand by Me',
    director: 'Rob Reiner'
  }
];

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
  res.status(200).json(topMovies);
});

//Static files to serve documentation.html file from public folder 
app.use(express.static('public'));

//Error Handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listens to the three request from above and links them to port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});