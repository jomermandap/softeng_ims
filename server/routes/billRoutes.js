const express = require('express');
const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const Product = require('../models/Product');
const router = express.Router();



// Route to create a new bill
router.post('/create', async (req, res) => {
  const { billNumber, productSku, quantity, totalAmount, vendorName, paymentType } = req.body;

  try {
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity. Quantity must be greater than zero.' });
    }

    // Check if the product exists
    const product = await Product.findOne({ sku: productSku });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure sufficient stock
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock available. Only ${product.stock} units are in stock.`,
      });
    }

    // Create the new bill
    const newBill = new Bill({
      billNumber,
      productSku,
      quantity,
      totalAmount,
      vendorName,
      paymentType,
    });

    await newBill.save();

    // Reduce stock by the exact quantity
    const updatedProduct = await Product.findOneAndUpdate(
      { sku: productSku },
      { $inc: { stock: -quantity } }, // Reduce stock
      { new: true }
    );

    res.status(201).json({
      message: 'Bill created successfully',
      bill: newBill,
      updatedProduct,
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'An error occurred while creating the bill.' });
  }
});

// Route to fetch all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find(); // Fetch all bills from the database
    res.status(200).json(bills); // Return the bills as JSON
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//New Routes:

// Route to delete a bill by billNumber
router.delete('/delete/:billNumber', async (req, res) => {
  const { billNumber } = req.params;

  try {
    const deletedBill = await Bill.findOneAndDelete({ billNumber });

    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Restore stock levels
    await Product.findOneAndUpdate(
      { sku: deletedBill.productSku },
      { $inc: { stock: deletedBill.quantity } }
    );

    res.status(200).json({ message: 'Bill deleted successfully', bill: deletedBill });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: 'An error occurred while deleting the bill.' });
  }
});


// Route to mark a bill as paid
router.put('/mark-paid/:billNumber', async (req, res) => {
  const { billNumber } = req.params;

  try {
    const updatedBill = await Bill.findOneAndUpdate(
      { billNumber },
      { paymentType: 'Paid' },
      { new: true } // Return the updated document
    );

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json({
      message: 'Bill marked as paid successfully',
      bill: updatedBill,
    });
  } catch (error) {
    console.error('Error marking bill as paid:', error);
    res.status(500).json({ message: 'An error occurred while updating the bill status.' });
  }
});

module.exports = router;
