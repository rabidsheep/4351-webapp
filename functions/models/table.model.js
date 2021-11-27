const mongoose = require('mongoose');

module.exports = mongoose.model(
    "tables",
    mongoose.Schema(
        {
            tid: { type: String, required: true, unique: true },
            size: { type: Number, required: true }
        }
    )
);