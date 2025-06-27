const movieModel = require('../models/movieModel');

const addMovie = async (req, res) => {
    try {
        const newMovie = await movieModel.create(req.body);
        res.status(201).json({ success: true, message: 'New movie added', data: newMovie });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const allMovies = await movieModel.find();
        res.status(200).json({
            success: true,
            message: 'All movies fetched',
            data: allMovies
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        const ifExists = await movieModel.findById(req.params.movieId);
        if (!ifExists) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }
        const updateMovie = await movieModel.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
        res.status(200).json({ success: true, message: 'Movie data updated', data: updateMovie });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const ifExists = await movieModel.findById(req.params.movieId);
        if (!ifExists) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }
        const deleteMovie = await movieModel.findByIdAndDelete(req.params.movieId);
        res.status(200).json({ success: true, message: 'Movie deleted', data: deleteMovie });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getMovieById = async (req, res) => {
    try {
      const movie = await movieModel.findById(req.params.movieId);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Movie fetched successfully',
        data: movie,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
  
module.exports = { addMovie, getAllMovies, updateMovie, deleteMovie, getMovieById };