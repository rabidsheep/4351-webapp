const mongoose = require('mongoose');
const address = require('./address.model');

module.exports = mongoose.model(
    "payment",
    mongoose.Schema(
        {
            cardholderName: { type: String, required: true },
            cardNum: { type: String, required: true },
            cvv: { type: String, required: true },
            expirationDate: { type: String, required: true },
            billing: { type: address.schema, required: true }
        }
    )
);