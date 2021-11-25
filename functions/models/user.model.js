const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const address = require('./address.model');
const payment = require('./payment.model');

module.exports = mongoose.model(
    "user",
    mongoose.Schema(
        {
            uid: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            phone: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            mailing: { type: address.schema, required: true },
            dinerId: { type: String, required: true, unique: true },
            points: { type: Number, required: true },
            paymentMethod: { type: payment.schema, required: true },
            reservations: { type: Array, require: false }
        }
    )
);