// Author: Sam Tucker
// Purpose: Provides the routes for the carts

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Create a cart
router.post('/create', async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all carts
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a cart by associated account
router.get('/:account', async (req, res) => {
    try {
        const cart = await Cart.findOne({ associatedAccount: req.params.account });
        if (!cart) throw new Error('Cart not found');
        res.status(200).json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Add items to cart
router.put('/:account/add', async (req, res) => {
    try {
        const cart = await Cart.findOne({ associatedAccount: req.params.account });
        if (!cart) throw new Error('Cart not found');

        cart.items.push(...req.body.items); // req.body.items is an array
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Remove an item from the cart
router.put('/:account/remove', async (req, res) => {
    try {
        const cart = await Cart.findOne({ associatedAccount: req.params.account });
        if (!cart) throw new Error('Cart not found');

        // Remove the single item from the cart
        const itemIdToRemove = req.body.itemId; // Extract single itemId from the request body
        cart.items = cart.items.filter(itemId => itemId !== itemIdToRemove);

        await cart.save();
        res.status(200).json(cart); // Send the updated cart back as the response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Send error message if any
    }
});


module.exports = router;
