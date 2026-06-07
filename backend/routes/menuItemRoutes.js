const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const menuItem = require('../modules/MenuItem');

router.post('/menu', authMiddleware, async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const menuItems = await menuItem.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const updatedItem = await menuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
      },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await menuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;