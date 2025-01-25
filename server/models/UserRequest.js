const mongoose = require('mongoose');

const userRequestSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true,
      enum: ['Retail', 'Manufacturing', 'Wholesale', 'Restaurant', 'Healthcare', 'Technology', 'Other']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const UserRequest = mongoose.model('UserRequest', userRequestSchema);
module.exports = UserRequest;
