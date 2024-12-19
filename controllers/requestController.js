const Request = require('../models/requestModel');
const User = require('../models/userModel');

// Define compatible blood types
const compatibleBloodTypes = {
  "A+": ["A+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "B+": ["B+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "AB+": ["AB+"],
  "AB-": ["AB+", "AB-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
};

// Create a blood request
exports.createRequest = async (req, res) => {
  const { recipientName, recipientContact, bloodGroup, urgencyLevel, location, quantity, notes } = req.body;

  try {
    const newRequest = new Request({
      recipientName,
      recipientContact,
      bloodGroup,
      urgencyLevel,
      location,
      quantity,
      notes,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Blood request created successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search for donors
exports.searchDonors = async (req, res) => {
  const { bloodGroup, location } = req.query;

  console.log('Search Donors Request:', { bloodGroup, location });

  try {
    // Determine compatible blood types
    const compatibleTypes = compatibleBloodTypes[bloodGroup];

    // Perform case-insensitive, partial match on location
    const compatibleDonors = await User.find({
      bloodGroup: { $in: compatibleTypes },
      location: { $regex: new RegExp(location, 'i') } // Case-insensitive regex match for location
    });

    console.log('Compatible Donors:', compatibleDonors);

    if (compatibleDonors.length === 0) {
      return res.status(404).json({ message: 'No compatible donors found' });
    }

    res.status(200).json({ donors: compatibleDonors });
  } catch (error) {
    console.error('Error searching for donors:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
