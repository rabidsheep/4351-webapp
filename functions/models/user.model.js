const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const reservation = require('./reservation.model')
module.exports = mongoose.model(
        "user",
        mongoose.Schema(
            {
                _id: {type: String},
                firstName: {type: String, required: true},
                lastName: {type: String, required: true},
                mailing: {type: Object, required: true},
                billing: {type: Object, required: true},
                preferred: {type: Number, required: true, unique: true},
                points: {type: Number, required: true},
                paymentMethod: {type: Object, required: true},
                phone: { type: String, required: true, unique: true},
                email: { type: String, required: true, unique: true},
                reservations: {type: [reservation.schema]}
            }
        )
    );