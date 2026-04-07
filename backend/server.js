const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Ride = require('./models/Ride');

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || process.env.mongodb_URI || process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.post('/addRide', async (req, res) => {
  try {
    const newRide = await Ride.create(req.body);
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: 'Could not add ride' });
  }
});

app.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch rides' });
  }
});

async function startServer() {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGO_URI in backend/.env.');
  }

  await mongoose.connect(mongoUri);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log('MongoDB connected');
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});