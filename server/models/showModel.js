const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  showName: { type: String, required: true },
  showDate: { type: String, required: true }, 
  showTime: { type: String, required: true }, 
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movies',
    required: true,
  },
  ticketPrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }, // need to include while sending baceknd route
  bookedSeats: {type: Array, default: []},
  // foreign key
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'theatres',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('shows', showSchema);
