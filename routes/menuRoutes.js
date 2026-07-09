const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// POST route to add a new menu item
router.post('/add', async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route to fetch all menu items
router.get('/', async (req, res) => {
  try {
    const items = await Menu.find(); // This fetches everything from the Menu collection
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;