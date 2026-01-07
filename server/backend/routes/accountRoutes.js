// Author: Sam Tucker
// Purpose: Provides the routes for the accounts

const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Cart = require('../models/Cart');

// Create an account
router.post('/create', async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all accounts
router.get('/', async (req, res) => {
    try {
        const accounts = await Account.find().populate('cart');
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read an account by name
router.get('/:name', async (req, res) => {
    try {
        const account = await Account.findOne({ uniqueName: req.params.name }).populate('cart');
        if (!account) throw new Error('Account not found');
        res.status(200).json(account);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Update an account's available money
router.put('/:name/money', async (req, res) => {
    try {
        const updatedAccount = await Account.findOneAndUpdate(
            { uniqueName: req.params.name },
            { $inc: { availableMoney: req.body.deposit } },
            { new: true }
        );
        res.status(200).json(updatedAccount);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an account by name
router.delete('/:name', async (req, res) => {
    try {
        await Account.findOneAndDelete({ uniqueName: req.params.name });
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create a new account
router.post('/', async (req, res) => {
    const { uniqueName, availableMoney } = req.body;
    try {
        const existingAccount = await Account.findOne({ uniqueName });
        if (existingAccount) return res.status(200).json({ message: 'Account already exists' });

        // Create a new account
        const newAccount = new Account({ uniqueName, availableMoney });
        await newAccount.save();

        // Create an empty cart associated with the account
        const newCart = new Cart({ associatedAccount: uniqueName, items: [] });
        await newCart.save();

        // Set newAccount's cart attribute to newCart
        newAccount.cart = newCart._id;
        await newAccount.save();  // Save the account with the updated cart reference

        res.status(201).json({
            account: newAccount,
            cart: newCart,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});



module.exports = router;
