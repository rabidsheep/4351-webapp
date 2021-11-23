const mongoose = require('mongoose');
module.exports = mongoose.model(
        "payment",
        mongoose.Schema(
            {
                name: {type: String, required: true},
                number: {type: String, required: true},
                expirationDate: {type: Date, required: true},
                billing: {type: String, required: true}
            }
        )
    );