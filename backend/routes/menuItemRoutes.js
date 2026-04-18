const express = require('express');

const router = express.Router();

const menuItem = require('../modules/MenuItem');

router.post('/menu', async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const menuitem = await menuItem.create({
            name,
            price,
            category
        });
        res.status(201).json({ message: 'MenuList created', menuitem });
    } catch {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;