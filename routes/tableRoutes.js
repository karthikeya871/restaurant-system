const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// Route to check availability
router.get('/status/:number', async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.number });
    
    // Check if the table exists
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    
    res.json({ tableNumber: table.tableNumber, occupied: table.isOccupied });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put('/update/:number', async (req, res) => {
  const { isOccupied } = req.body;
  const table = await Table.findOneAndUpdate(
    { tableNumber: req.params.number },
    { isOccupied },
    { new: true } // returns the updated document
  );
  res.json({ message: "Status updated", table });
});

module.exports = router;
