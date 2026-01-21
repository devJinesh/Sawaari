const { v4: uuidv4 } = require("uuid");
const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");
const Payment = require("../Models/paymentModel");
const crypto = require("crypto");
const moment = require("moment");

exports.bookCar = async (req, res) => {
  const { paymentId, car: carId, bookedTimeSlots } = req.body;
  
  try {
    // Validate the booking doesn't overlap with existing bookings
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const requestedFrom = moment(bookedTimeSlots.from, "DD/MM/YYYY HH:mm");
    const requestedTo = moment(bookedTimeSlots.to, "DD/MM/YYYY HH:mm");

    // Check for overlapping bookings
    for (const slot of car.bookedTimeSlots) {
      const existingFrom = moment(slot.from, "DD/MM/YYYY HH:mm");
      const existingTo = moment(slot.to, "DD/MM/YYYY HH:mm");

      if (
        requestedFrom.isBetween(existingFrom, existingTo, undefined, "[]") ||
        requestedTo.isBetween(existingFrom, existingTo, undefined, "[]") ||
        existingFrom.isBetween(requestedFrom, requestedTo, undefined, "[]") ||
        existingTo.isBetween(requestedFrom, requestedTo, undefined, "[]")
      ) {
        return res.status(400).json({ 
          error: "This car is already booked for the selected time slot" 
        });
      }
    }

    const transactionId = paymentId || uuidv4();
    const newBooking = new Booking({
      ...req.body,
      user: req.userId,
      transactionId,
    });

    await newBooking.save();

    car.bookedTimeSlots.push(bookedTimeSlots);
    await car.save();

    res.status(201).json({ 
      success: true, 
      message: "Your booking is successful",
      booking: newBooking 
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Server error during booking" });
  }
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Save payment details to the database
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:3000"}/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Server error during payment verification" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    let bookings;
    
    // If user is admin, return all bookings; otherwise, only user's bookings
    if (req.user.admin) {
      bookings = await Booking.find().populate("car").populate("user");
    } else {
      bookings = await Booking.find({ user: req.userId }).populate("car").populate("user");
    }

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ error: "Server error fetching bookings" });
  }
};
