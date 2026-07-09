const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors()); // Allow frontend to talk to backend
// 1. Initialize JSON parser FIRST
app.use(express.json()); 

// 2. Import and Use Routes
const reservationRoutes = require('./routes/reservationRoutes');
// Add this line to test if the router is mounted
console.log("Reservation routes mounted on /api/reservations");
app.use('/api/reservations', reservationRoutes);

const menuRoutes = require('./routes/menuRoutes');

app.use('/api/menu', menuRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
console.log("Order routes are mounted!");

// 3. Database Connection
const dbURI = 'mongodb+srv://karthikeyaedupuganti_db_user:karthik123@url-shortener-cluster.lj6hot3.mongodb.net/restaurantDB?appName=url-shortener-cluster';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Database connection error:', err));

app.get('/', (req, res) => {
  res.send('Restaurant Management System is live!');
});

// Add this right before your app.listen(...)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});