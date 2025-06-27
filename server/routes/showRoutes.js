const express = require('express');
const { addShow, getAllShowsById, getShowsByTheatre, getAllTheatresByMovieAndDate, deleteShow, updateShow } = require('../controllers/showController');
const showRouter = express.Router();

// add-show
showRouter.post('/add-show', addShow);

// getAllShows By id
showRouter.get("/get-show-by-id/:id", getAllShowsById);

// Get shows by theatre
showRouter.get('/get-shows-by-theatre/:theatreId', getShowsByTheatre );

// Get all theatres by movie and date
showRouter.get('/get-all-theatres-by-movie/:movieId/:date', getAllTheatresByMovieAndDate);

// Delete show
showRouter.delete('/delete-show/:id', deleteShow);

// Update show
showRouter.put('/update-show/:id', updateShow);

module.exports = showRouter;