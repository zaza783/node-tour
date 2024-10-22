const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'There must be a user.'],
    },
    price: {
        type: Number,
        required: [true, 'there must be a price.'],
    },
    createdAt: {
        type: Date,
        required: [true, 'There must be date that the user created his account'],
    },
    paid: {
        type: String,
        required: [true, 'Payment is required'],

    },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;