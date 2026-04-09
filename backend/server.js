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

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during signup' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during login' });
  }
});

app.post('/addRide', async (req, res) => {
  try {
    const newRide = await Ride.create(req.body);
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: 'Could not add ride' });
  }
});

const RideRequest = require('./models/RideRequest');

app.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch rides' });
  }
});

app.get('/rides/search', async (req, res) => {
  try {
    const { from, to, time } = req.query;
    let query = {};
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (time) query.time = { $regex: time, $options: 'i' };
    query.seats = { $gt: 0 };
    const rides = await Ride.find(query).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Could not search rides' });
  }
});

app.post('/rides/request', async (req, res) => {
  try {
    const { rideId, riderId } = req.body;
    const existing = await RideRequest.findOne({ rideId, riderId });
    if (existing) return res.status(400).json({ message: 'Already requested' });
    const newReq = await RideRequest.create({ rideId, riderId });
    res.status(201).json(newReq);
  } catch (error) {
    res.status(500).json({ message: 'Could not send request' });
  }
});

app.get('/api/driver/requests', async (req, res) => {
  try {
    const { driverName } = req.query;
    let rides;
    if (driverName) {
      rides = await Ride.find({ driverName });
    } else {
      rides = await Ride.find();
    }
    const rideIds = rides.map(r => r._id);
    const requests = await RideRequest.find({ rideId: { $in: rideIds } })
      .populate('rideId')
      .populate('riderId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch driver requests' });
  }
});

app.get('/api/rider/requests', async (req, res) => {
  try {
    const { riderId } = req.query;
    const requests = await RideRequest.find({ riderId }).populate('rideId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch rider requests' });
  }
});

app.post('/rides/request/:id/:status', async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    
    const rideReq = await RideRequest.findById(id).populate('rideId');
    if (!rideReq) return res.status(404).json({ message: 'Request not found' });
    
    // Only reduce seats if status changes to accepted from pending
    if (status === 'accepted' && rideReq.status !== 'accepted') {
      const ride = await Ride.findById(rideReq.rideId._id);
      if (ride.seats > 0) {
        ride.seats -= 1;
        await ride.save();
      } else {
        return res.status(400).json({ message: 'No seats available' });
      }
    }
    
    rideReq.status = status;
    await rideReq.save();
    
    res.json({ message: `Request ${status}`, request: rideReq });
  } catch (error) {
    res.status(500).json({ message: 'Could not update request status' });
  }
});

async function startServer() {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGO_URI in backend/.env.');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`MongoDB connected to ${mongoose.connection.name}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  console.error('Atlas checklist: verify the URI, the database user/password, your current IP in Network Access, and the database name in the connection string.');
  process.exit(1);
});
