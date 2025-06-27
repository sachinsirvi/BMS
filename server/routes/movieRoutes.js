const express = require('express');
const auth = require('../middlewares/authMiddleware');
const movieRouter = express.Router();
const { addMovie, getAllMovies, updateMovie, deleteMovie, getMovieById } = require('../controllers/movieController');

// get all movies
movieRouter.get('/get-all-movies', getAllMovies);

// add a movie
movieRouter.post('/add-movie', auth, addMovie);

// update a movie
movieRouter.put('/update-movie/:movieId', auth, updateMovie);

// delete a movie
movieRouter.delete('/delete-movie/:movieId', auth, deleteMovie);

// single movie 
movieRouter.get('/get-movie/:movieId', getMovieById);

module.exports = movieRouter;