// Author: Sam Tucker
// Purpose: Account model

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', // Reference to the Cart model
    },
    uniqueName: {
        type: String,
        unique: true,
        required: true,
    },
    availableMoney: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Account', accountSchema);
