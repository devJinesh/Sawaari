const { body, param, validationResult } = require("express-validator");

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be between 10 and 15 digits"),
];

// User login validation
exports.validateLogin = [
  body("email").trim().isEmail().withMessage("Must be a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Car validation
exports.validateCar = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Car name must be between 2 and 100 characters"),
  body("image")
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("capacity")
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),
  body("fuelType")
    .trim()
    .isIn(["Petrol", "Diesel", "Electric", "Hybrid", "CNG"])
    .withMessage("Invalid fuel type"),
  body("rentPerHour")
    .isFloat({ min: 0, max: 100000 })
    .withMessage("Rent per hour must be a positive number"),
];

// Booking validation
exports.validateBooking = [
  body("car").isMongoId().withMessage("Invalid car ID"),
  body("bookedTimeSlots.from")
    .notEmpty()
    .withMessage("Start time is required"),
  body("bookedTimeSlots.to")
    .notEmpty()
    .withMessage("End time is required"),
  body("totalMins")
    .isInt({ min: 1 })
    .withMessage("Total minutes must be a positive number"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),
  body("driverRequired")
    .isBoolean()
    .withMessage("Driver required must be true or false"),
  body("transactionId")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Transaction ID is required"),
];

// ObjectID validation
exports.validateObjectId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage("Invalid ID format"),
];
