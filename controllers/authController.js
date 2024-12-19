const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Registration
exports.registerUser = async (req, res) => {
  const {
        name,
        contact,
        age,
        email,
        aadhar,
        "blood-group": bloodGroup,  // mapping 'blood-group' from form to 'bloodGroup' in schema
        location,
        "medical-history": medicalHistory,  // mapping 'medical-history' from form to 'medicalHistory' in schema
        "emergency-name": emergencyName,  // mapping 'emergency-name' from form to 'emergencyContact.name' in schema
        "emergency-phone": emergencyPhone,  // mapping 'emergency-phone' from form to 'emergencyContact.phone' in schema
        password,
      } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      contact,
      age,
      email,
      aadhar,
      bloodGroup,
      location,
      medicalHistory: medicalHistory || "None", // Default to 'None' if empty
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
      },
      password,
    });

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    console.log("Hashed password:", newUser.password);

    // Save the user
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request received:", req.body);

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
