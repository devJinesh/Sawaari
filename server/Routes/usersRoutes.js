const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { validateLogin, validateRegister, handleValidationErrors } = require("../middleware/validation");

router.post("/login", validateLogin, handleValidationErrors, userController.login);
router.post("/register", validateRegister, handleValidationErrors, userController.register);

module.exports = router;
