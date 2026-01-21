const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  admin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
