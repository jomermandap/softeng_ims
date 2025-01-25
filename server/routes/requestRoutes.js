const express = require('express');
const UserRequest = require('../models/UserRequest');
const router = express.Router();

// Route to handle access request
router.post('/request', async (req, res) => {
  const { businessName, industry, email, phone, description } = req.body;

  try {
    // Check if the business email already exists
    const existingRequest = await UserRequest.findOne({ email });
    if (existingRequest) {
      return res.status(400).json({ error: 'A request with this email already exists.' });
    }

    const userRequest = new UserRequest({
      businessName, // Changed from 'name' to 'businessName'
      email,
      phone, // Changed from 'mobileNumber' to 'phone'
      status: 'pending',
      industry,
      description
    });

    await userRequest.save();

    // Send a success response
    res.status(201).json({
      message: 'Request submitted successfully. We will review and notify you through email.'
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
