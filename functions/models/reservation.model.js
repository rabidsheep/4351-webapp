const mongoose = require('mongoose');
const payment = require('./payment.model');

module.exports = mongoose.model(
    "reservations",
    mongoose.Schema(
        {
            uid: { type: String, required: false },
            firstName:  { type: String, required: true },
            lastName: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            date:  { type: Date, required: true },
            time: { type: String, required: true },
            numGuests: { type: Number, required: true },
            tables: { type: Array, required: true },
            payment: { type: payment.schema, required: false },
            discount: { type: Number, required: false }
        }
    )
);