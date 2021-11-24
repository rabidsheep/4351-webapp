const mongoose = require('mongoose');
const table = require('./table.model');
const payment = require('./payment.model');
module.exports = mongoose.model(
        "reservations",
        mongoose.Schema(
            {
                firstName:  { type: String, required: true},
                lastName: { type: String, required: true},
                phone: { type: String, required: true},
                email: { type: String, required: true},
                date:  { type: Date, required: true},
                tables: { type: [table.schema], required: true},
                payment: {type: payment.schema}
            }
        )
    );