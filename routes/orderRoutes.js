const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table'); // <--- ADD THIS LINE
const Menu = require('../models/Menu');
const Inventory = require('../models/Inventory');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add this to your orderRoutes.js
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/place', async (req, res) => {
  try {
    const { tableNumber, items } = req.body; 

    // 1. Update Table Status AND Check if it exists
    const updatedTable = await Table.findOneAndUpdate(
      { tableNumber: tableNumber }, 
      { isOccupied: true },
      { new: true } // Ensures you get the updated document back
    );

    // This is the check you need
    if (!updatedTable) {
      return res.status(404).json({ message: "Table number not found in database!" });
    }

    // 2. Loop through each item in the order
for (let itemId of items) {
  const menuItem = await Menu.findById(itemId);
  
  if (menuItem) {
    for (let ingredientName of menuItem.ingredients) {
      // --- START: ADD THIS CHECK ---
      const ingredient = await Inventory.findOne({ itemName: ingredientName });
      
      if (!ingredient || ingredient.quantity <= 0) {
        return res.status(400).json({ message: `Out of stock or missing: ${ingredientName}` });
      }
      await Inventory.findOneAndUpdate(
        { itemName: ingredientName }, 
        { $inc: { quantity: -1 } }
      );
    }
  }
}

    // 3. Save the Order
    const newOrder = new Order({ tableNumber, items });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/checkout/:tableNumber', async (req, res) => {
  try {
    const table = await Table.findOneAndUpdate(
      { tableNumber: req.params.tableNumber },
      { isOccupied: false },
      { new: true }
    );
    res.json({ message: "Table checked out successfully!", table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;