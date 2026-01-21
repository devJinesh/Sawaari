const express = require("express");
const router = express.Router();
const carController = require("../Controllers/carController");
const { authenticate, isAdmin } = require("../middleware/auth");
const { validateCar, handleValidationErrors } = require("../middleware/validation");

router.get("/getallcars", carController.getAllcars);
router.post("/addcar", authenticate, isAdmin, validateCar, handleValidationErrors, carController.addCar);
router.put("/editcar", authenticate, isAdmin, validateCar, handleValidationErrors, carController.editCar);
router.post("/deletecar", authenticate, isAdmin, carController.deleteCar);

module.exports = router;
