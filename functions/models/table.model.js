const mongoose = require('mongoose');

module.exports = mongoose.model(
        "table",
        mongoose.Schema(
            {
                size: {type: Number, required: true}
            }
        )
    );