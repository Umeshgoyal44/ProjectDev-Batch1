const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driverName: String,
    from: String,
    to: String,
    time: String,
    seats: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);