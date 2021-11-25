const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const address = require('./address.model');
const payment = require('./payment.model');

module.exports = mongoose.model(
    "user",
    mongoose.Schema(
        {
            _id: {type: ObjectId, required: true},
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            mailing: {type: address.schema, required: true},
            preferred: {type: Number, required: true, unique: true},
            points: {type: Number, required: true},
            paymentMethod: {type: Object, required: true},
            phone: { type: String, required: true, unique: true},
            email: { type: String, required: true, unique: true},
            reservations: {type: Array}
        }
    )
);