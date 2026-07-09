const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  items: [String],
  total: Number,
  status: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Order', orderSchema);