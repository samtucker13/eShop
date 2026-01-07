// Author: Sam Tucker
// Purpose: Item model

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    seller: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    inCart: {
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = mongoose.model('Item', itemSchema);
