const mongoose = require('mongoose');
const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  capacity: Number,
  isOccupied: { type: Boolean, default: false }
});
module.exports = mongoose.model('Table', tableSchema);