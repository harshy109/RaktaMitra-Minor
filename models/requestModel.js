const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  recipientContact: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  urgencyLevel: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;