const mongoose = require('mongoose');

module.exports = mongoose.model(
    "address",
    mongoose.Schema(
        {
            line1: { type: String, required: true },
            line2: { type: String, required: false },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true }
        }
    )
);