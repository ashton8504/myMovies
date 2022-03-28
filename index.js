const express = require("express"),//imports express framework
    bodyParser = require('body-parser'), //imports body parser
    uuid = require('uuid');//imports uuid

const morgan = require('morgan');//imports morgannod
const app = express(); //Declares a variable that encapsulates express's functionality
const mongoose = require('mongoose');//intergate Mongoose in REST API
const Models = require('./models.js');//intergate Mongoose in REST API

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myMoviesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(morgan ('common'));//log requests to server

//Get Requests
app.get('/', (req, res) => {
    res.send('Welcome to myMovie website! ')
});

//Add a user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
              .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
              .then((user) =>{res.status(201).json(user) })
              .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
              })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

//Get all Users
app.get('/users', (req, res) => {
  Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Get all Movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Get all movies by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get all genres by name
app.get('/genre/:Name', (req, res) => {
    Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.json(genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/director/:Name', (req, res) => {
    Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
//Update a users' info by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
            {
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if(err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Reads the documentation
// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

//Static files to serve documentation.html file from public folder 
app.use(express.static('public'));

//Error Handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listens to the three request from above and links them to port 8080
app.listen(8080, () => { console.log('Your app is listening on port 8080.');
});


//saving below code for backup

//
//
//
// const express = require("express"),//imports express framework
//     app = express(), //Declares a variable that encapsulates express's functionality
//     bodyParser = require('body-parser'), //imports body parser
//     morgan = require('morgan'),//imports morgannod
//     uuid = require('uuid');//imports uuid
//
// const mongoose = require('mongoose');//intergate Mongoose in REST API
// const Models = require('./models.js');//intergate Mongoose in REST API
// const Movies = Models.Movie;
// const Users = Models.User;
//
// mongoose.connect('mongodb://localhost:27017/myMoviesDB', { useNewUrlParser: true, useUnifiedTopology: true });
//
// app.use(bodyParser.json());
// app.use(morgan ('common'));
//
// let users = [
//   {
//     id: 1,
//     name: "Neil",
//     favoriteMovies: []
//   },
//   {
//     id: 2,
//     name: 'Ashton',
//     favoriteMovies: ["Cool Hand Luke"]
//   }
// ]
//
// let movies = [
//   {
//     'Title': 'Cool Hand Luke',
//     'Description': 'A laid back Southern man is sentenced to two years in a rural prison, but refuses to conform.',
//     'Genre': {
//       'Name': 'Drama',
//       'Description': 'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone'
//     },
//     'Director': {
//       'Name': 'Stuart Rosenberg',
//       'Bio':'Stuart Rosenberg was born on August 11, 1927 in Brooklyn, New York City, New York, USA. He was a director and producer, known for Cool Hand Luke (1967), Question 7 (1961) and The Defenders (1961). He was married to Margot Pohoryles. He died on March 15, 2007 in Beverly Hills, Los Angeles, California, USA.'
//     }
//   },
//   {
//     'Title': 'The Batman',
//     'Description': "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
//     'Genre': {
//       'Name': 'Drama',
//       'Description': 'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone'
//     },
//     'Director': {
//       'Name': 'Matt Reeves',
//       'Bio':'Matthew George "Matt" Reeves was born April 27, 1966 in Rockville Center, New York, USA and is a writer, director and producer. Reeves began making movies at age eight, directing friends and using a wind-up camera. '
//     }
//   },
//   {
//     'Title': 'Stand by Me',
//     'Description': 'After the death of one of his friends, a writer recounts a childhood journey with his friends to find the body of a missing boy.',
//     'Genre': {
//       'Name': 'Drama',
//       'Description': 'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone'
//     },
//     'Director': {
//       'Name': 'Rob Reiner',
//       'Bio': "Robert Reiner was born in New York City, to Estelle Reiner (née Lebost) and Emmy-winning actor, comedian, writer, and producer Carl Reiner. As a child, his father was his role model, as Carl Reiner created and starred in The Dick Van Dyke Show. Estelle was also an inspiration for him to become a director; her experience as a singer helped him understand how music was used in a scene. Rob often felt pressured about measuring up to his father's successful streak, with twelve Emmys and other prestigious awards."
//     }
//   },
//   {
//     'Title': 'Star Wars: Episode VI - Return of the Jedi',
//     'Description': "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star. Meanwhile, Luke struggles to help Darth Vader back from the dark side without falling into the Emperor's trap.",
//     'Genre': {
//       'Name': 'Action',
//       'Description': 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
//     },
//     'Director': {
//       'Name': 'Richard Marquand',
//       'Bio':"Richard Marquand was born on September 22, 1937 in Llanishen, Cardiff, Glamorgan, Wales. He was a director and producer, known for Star Wars: Episode VI - Return of the Jedi (1983), Jagged Edge (1985) and Nowhere to Run (1993). He was married to Carol Bell and Josephine Marquand. He died on September 4, 1987 in Tunbridge Wells, Kent, England."
//     }
//   },
// ];
//
// //Get Requests
// app.get('/', (req, res) => {
//   res.send('Welcome to myMovie website! ')
// });
//
// //READ and works with Json
// app.get('/movies', (req, res) => {
//   res.status(200).json(movies);
// });
//
// //READ
// app.get('/movies/:title', (req, res) => {
//   const { title } = req.params;
//   const movie = movies.find(movie => movie.Title === title);
//
//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send('no such movie')
//   }
// });
//
// //READ
// app.get('/movies/genre/:genreName', (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
//
//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(400).send('Genre not found.')
//   }
// });
//
// //READ
// app.get('/movies/directors/:directorName', (req, res) => {
//   const { directorName } = req.params;
//   const director = movies.find(movie => movie.Director.Name === directorName).Director;
//
//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(400).send('Director not found')
//   }
// });
//
//
// //CREATE
// app.post('/users', (req, res) => {
//   const newUser = req.body;
//
//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   } else {
//     res.status(400).send('users need names')
//   }
// });
//
// //UPDATE
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;
//   let user = users.find(user => user.id == id);
//
//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send('no such user')
//   }
// });
//
// //CREATE
// app.post('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;
//   let user = users.find(user => user.id == id);
//
//   if (user) {
//     user.favoriteMovies.push(movieTitle);
//     res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
//   } else {
//     res.status(400).send('no such user')
//   }
// });
//
// //DELETE
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;
//   let user = users.find(user => user.id == id);
//
//   if (user) {
//     user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
//     res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//   } else {
//     res.status(400).send('no such user')
//   }
// });
//
// //DELETE
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;
//   let user = users.find(user => user.id == id);
//
//   if (user) {
//     users = users.filter(user => user.id != id);
//     res.status(200).send(`user ${id} has been deleted`);
//   } else {
//     res.status(400).send('User not found.')
//   }
// });
//
//
// //Reads the documentation
// // app.get('/documentation', (req, res) => {
// //   res.sendFile('public/documentation.html', { root: __dirname });
// // });
//
//
//
//
// //Static files to serve documentation.html file from public folder
// app.use(express.static('public'));
//
// //Error Handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
//
// //listens to the three request from above and links them to port 8080
// app.listen(8080, () => { console.log('Your app is listening on port 8080.');
// });
//





