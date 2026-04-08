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