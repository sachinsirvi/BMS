
const stripe = require("stripe")(process.env.STRIPE_KEY);
const bookingModel = require("../models/bookingModel");
const showModel = require("../models/showModel");
const emailHelper = require("../utils/emailHelper");

const makePayment = async (req, res) => {
    try {
      const { amount } = req.body;
      // PaymentIntent to get client_secret
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });
      res.send({
        success: true,
        message: "Client secret generated",
        data: { clientSecret: paymentIntent.client_secret },
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to create payment intent",
        error: err.message,
      });
    }
};

const bookShow = async (req, res) => {
    try {
      // save the new booking in db
      const newBooking = await bookingModel.create(req.body);
      // update the bookedSeats field of show, so that other users cant book the same
      const show = await showModel.findById(req.body.show).populate("movie");
      const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
      show.bookedSeats = updatedBookedSeats;
      await show.save();
      
      const ticketDetails = await bookingModel.findById(newBooking._id)
      .populate("show").populate("user")
      .populate({path: "show", populate: ({path: "movie",model: "movies"})})
      .populate({path: "show", populate: ({path: "theatre",model: "theatres"})})
  
      res.send({
        success: true,
        message: "Show booked successfully",
        data: ticketDetails,
      });
  
      try {
        await emailHelper(
          ticketDetails.user.email,
          {
            name: ticketDetails.user.name,
            ticketId: ticketDetails._id.toString(),
            movieName: ticketDetails.show.movie.title,
            theatreName: ticketDetails.show.theatre.name,
            showDateTime: `${ticketDetails.show.showDate} at ${ticketDetails.show.showTime}`,
            seats: ticketDetails.seats.join(", ")
          },
          "ticket.html",
          "🍿 Booking Confirmation - BookMyShow"
        );
        
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to book show",
        error: err.message,
      })
    }
};

const getAllBookingsByUser = async (req, res) => {
    try {
      const myBookings = await bookingModel.find({ user: req.userId })
        .populate("show")
        .populate("user")
        .populate({ path: "show", populate: { path: "movie", model: "movies" } })
        .populate({ path: "show", populate: { path: "theatre", model: "theatres" } });
  
      res.send({
        success: true,
        message: "Your Bookings Fetched",
        data: myBookings,
      });
  
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to fetch your bookings",
        error: err.message,
      });
    }
};
  
module.exports = { makePayment, bookShow, getAllBookingsByUser};