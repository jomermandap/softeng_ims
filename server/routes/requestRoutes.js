const express = require('express');
const bcrypt = require('bcrypt');
const UserRequest = require('../models/UserRequest');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route to handle access request
router.post('/request', async (req, res) => {
  const { name, email, mobileNumber, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingRequest = await UserRequest.findOne({ email });
    if (existingRequest) {
      return res.status(400).json({ error: 'You have already requested access.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user request
    const userRequest = new UserRequest({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      role
    });

    await userRequest.save();

    // Send a success response
    res.status(201).json({
      message: 'Request submitted successfully. You will be notified once approved.'
    });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


router.put('/approve-reject/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const userRequest = await UserRequest.findByIdAndUpdate(id, { status }, { new: true });

    if (!userRequest) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    res.status(200).json({ message: 'Request status updated', request: userRequest });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the request status.' });
  }
});

module.exports = router;
