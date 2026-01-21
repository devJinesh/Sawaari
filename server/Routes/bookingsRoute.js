const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");
const { authenticate, isAdmin } = require("../middleware/auth");
const { validateBooking, handleValidationErrors } = require("../middleware/validation");

// Booking routes
router.post("/bookcar", authenticate, validateBooking, handleValidationErrors, bookingController.bookCar);
router.get("/getallbookings", authenticate, bookingController.getAllBookings);

// Payment verification route
router.post("/payment-verification", bookingController.paymentVerification);

module.exports = router;