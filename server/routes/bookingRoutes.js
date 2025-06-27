const bookingRouter = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { makePayment, bookShow, getAllBookingsByUser } = require("../controllers/bookingController");

// Make payment
bookingRouter.post("/make-payment", auth, makePayment);

// Book a show
bookingRouter.post("/book-show", auth, bookShow );

// All bookings by user
bookingRouter.get("/get-all-bookings-by-user", auth, getAllBookingsByUser );

module.exports = bookingRouter;
