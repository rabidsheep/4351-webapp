const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
module.exports = mongoose.model(
    "tables",
    mongoose.Schema(
        {
            _id: {type: ObjectId, required: true},
            size: {type: Number, required: true}
        }
    )
);