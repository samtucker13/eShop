// Author: Sam Tucker
// Purpose: Cart model

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: {
        type: [Number], // Array of item IDs
        default: [],
    },
    associatedAccount: {
        type: String,
        required: true,
        unique: true, // One cart per account
    },
});

module.exports = mongoose.model('Cart', cartSchema);
