const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    poster: {type: String, required: true},
    genre: {type: String, required: true},
    rating: {type: Number, required: true},
    duration: {type: Number, required: true},
    releaseDate: {type: Date, required: true},
    language: {type: String, required: true},
});

const movieModel = mongoose.model('movies', movieSchema);

module.exports = movieModel;