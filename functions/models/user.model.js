const mongoose = require('mongoose');
const reservation = require('./reservation.model')
module.exports = mongoose.model(
        "user",
        mongoose.Schema(
            {
                _id: {type: String},
                name: {type: String, required: true},
                mailing: {type: String, required: true},
                billing: {type: String, required: true},
                preferred: {type: Number, required: true, unique: true},
                points: {type: Number, required: true},
                paymentMethod: {type: String, required: true},
                phone: { type: String, required: true, unique: true},
                email: { type: String, required: true, unique: true},
                reservations: {type: [reservation.schema]}
            }
        )
    );