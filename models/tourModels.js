const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const tourSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'A tour user must have a name'],
        
    },
    destination: {
        type: String,
        required:[true, 'A tour must have a destination'],
    },
    arrival: {
        type: String,
        required: [true, 'A tour user must have an arrival']
    },
    duration: {
        type: Number,
        required: [true, 'A tour user must have a duration']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour user must have a difficulty'],
        enum: {
            values: ['Email', 'Phone calls or live chats']
        },
        phone: {
            type: String,
            required: [true,'A tour must have a number']
        },
        ratings: {
            type: Number,
            default: 5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            required: [true, 'A tour user must have a rating']
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            required: false
        },
        description: {
            type: String,
            trim: true 
        },
        startDate: [Date],
        endDate: [Date]
    },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;