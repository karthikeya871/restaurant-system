const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');


// --- ADD THIS GET ROUTE ---
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/book', async (req, res) => {
  try {
    const { guestName, tableNumber, reservationTime } = req.body;

    // 1. Check if the table is already reserved at that time
    // We look for a booking for this table within 1 hour of the requested time
    const existingBooking = await Reservation.findOne({
      tableNumber,
      reservationTime: {
        $gte: new Date(new Date(reservationTime).getTime() - 60*60*1000),
        $lte: new Date(new Date(reservationTime).getTime() + 60*60*1000)
      }
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Table already reserved for this time slot!" });
    }

    // 2. Create the reservation
    const newReservation = new Reservation({ guestName, tableNumber, reservationTime });
    await newReservation.save();

    res.status(201).json({ message: "Reservation successful!", newReservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
