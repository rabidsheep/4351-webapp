const mongoose = require('mongoose');
const table = require('./table.model.js');

module.exports = mongoose.model(
        "reservations",
        mongoose.Schema(
            {
                name:  { type: String, required: true},
                phone: { type: String, required: true},
                email: { type: String, required: true},
                date:  { type: String, required: true},
                tables:{ type: [table.schema], required: true}
            }
        )
    );