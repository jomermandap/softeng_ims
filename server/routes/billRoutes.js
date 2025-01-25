const express = require('express');
const Bill = require('../models/Bill');
const router = express.Router();

// Route to create a new bill
router.post('/create', async (req, res) => {
  const { billNumber, productSku, quantity, totalAmount, vendorName, paymentType } = req.body;

  try {
    // Create a new bill instance
    const newBill = new Bill({
      billNumber,
      productSku,
      quantity,
      totalAmount,
      vendorName, 
      paymentType 
    });

    // Save the bill to the database
    await newBill.save();

    // Send a success response
    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'An error occurred while creating the bill.' });
  }
});

// Route to get all bill details
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'An error occurred while fetching bills.' });
  }
});

module.exports = router;
