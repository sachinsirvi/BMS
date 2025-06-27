const showModel = require('../models/showModel');

const addShow = async (req, res) => {
  try {
    const newShow = await showModel.create({
      ...req.body,
      availableSeats: req.body.totalSeats || 0, // Add this coz its required in model
    });
    res.status(201).json({
      success: true,
      message: 'New show added successfully',
      data: newShow
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

const getAllShowsById = async (req, res) => {
  try {
    const show = await showModel.findById(req.params.id)
      .populate("movie")
      .populate("theatre");
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.status(200).json({ success: true, data: show });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

const getShowsByTheatre = async (req, res) => {
  try {
    const shows = await showModel.find({ theatre: req.params.theatreId });
    res.status(200).json({
      success: true,
      data: shows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

const getAllTheatresByMovieAndDate = async (req, res) => {
  try {
    const { movieId, date } = req.params;
    const shows = await showModel.find({
      movie: movieId,
      showDate: date,
    }).populate('theatre');

    const theatreMap = {};
    shows.forEach((show) => {
      const theatreId = show.theatre._id.toString();
      if (!theatreMap[theatreId]) {
        theatreMap[theatreId] = {
          ...show.theatre._doc,
          shows: [],
        };
      }

      theatreMap[theatreId].shows.push({
        _id: show._id,
        time: show.showTime,
        ticketPrice: show.ticketPrice,
        name: show.showName,
      });
    });

    const uniqueTheatres = Object.values(theatreMap); // array

    res.status(200).json({
      success: true,
      data: uniqueTheatres,
      message: "All theatres by movie",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Failed to get all theatres by movie",
    });
  }
}

const deleteShow = async (req, res) => {
  try {
    const deleted = await showModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const updateShow = async (req, res) => {
  try {
    const updatedShow = await showModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: updatedShow
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  addShow,
  getAllShowsById,
  getShowsByTheatre,
  getAllTheatresByMovieAndDate,
  deleteShow,
  updateShow 
};
