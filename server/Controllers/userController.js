const User = require("../Models/userModal");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, username, phone } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newuser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    await newuser.save();
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'username') {
        return res.status(400).json({ error: "Username already taken" });
      } else if (field === 'email') {
        return res.status(400).json({ error: "Email already registered" });
      }
    }
    return res.status(500).json({ error: "Server error during registration" });
  }
};
