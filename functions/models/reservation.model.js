const mongoose = require('mongoose');
const table = require('./table.model.js');

module.exports = mongoose.model(
        "reservations",
        mongoose.Schema(
            {
                firstName:  { type: String, required: true },
                lastName: { type: String, required: true },
                phone: { type: String, required: true },
                email: { type: String, required: true },
                date:  { type: String, required: true },
                time: { type: String, required: true },
                tables: { type: [table.schema], required: true }
            }
        )
    );