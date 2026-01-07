// Author: Sam Tucker
// Purpose: Provides the routes for the items

const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create an item
router.post('/create', async (req, res) => {
    try {
        const { nameInput, priceInput, descInput, seller } = req.body;

        // Validate seller
        if (!seller) {
            return res.status(400).json({ error: 'Seller is required' });
        }

        // Create a new item
        const newItem = new Item({
            id: Date.now(),
            seller, // Use seller from the request body
            name: nameInput,
            price: priceInput,
            description: descInput,
        });

        await newItem.save();
        res.status(201).json({ message: 'Item created successfully', data: newItem });
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(500).json({ error: 'Failed to create item' });
    }
});


// Read all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findOne({ id: req.params.id });
        if (!item) throw new Error('Item not found');
        res.status(200).json(item);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Update an item by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an item by ID
router.delete('/:id', async (req, res) => {
    try {
        await Item.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
