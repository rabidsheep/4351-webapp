const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const payment = require('./payment.model');
const table = require('./table.model');

module.exports = mongoose.model(
    "reservations",
    mongoose.Schema(
        {
            firstName:  { type: String, required: true},
            lastName: { type: String, required: true},
            phone: { type: String, required: true},
            email: { type: String, required: true},
            date:  { type: Date, required: true},
            time: { type: String, required: true},
            numGuests: { type: Number, required: true },
            tables: { type: [table.schema], required: true},
            payment: { type: payment.schema }
        }
    )
);