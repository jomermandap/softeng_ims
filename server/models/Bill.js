const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  productSku: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  vendorName: { type: String, required: true },
  paymentType: { type: String, enum: ['paid', 'due'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
