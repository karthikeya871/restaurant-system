const mongoose = require('mongoose');
const resSchema = new mongoose.Schema({
  customerName: String,
  date: Date,
  tableNumber: Number
});
module.exports = mongoose.model('Reservation', resSchema);