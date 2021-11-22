const mongoose = require('mongoose');

module.exports = mongoose.model(
        "tables",
        mongoose.Schema(
            {
                size: {type: Number, required: true}
            }
        )
    );