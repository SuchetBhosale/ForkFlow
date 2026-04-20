const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Order = require('../modules/Order');
const socket = require('../socket');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        const userId = req.user.id;
        const order = await Order.create({
            user: userId,
            items,
            totalPrice
        })
        socket.getIO().emit('newOrder', order);
        res.status(201).json({ message: "Order Placed successfully!", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/allOrder', authMiddleware, async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find().sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        }
        res.status(200).json({ message: 'Here is all the Orders Placed!', orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        res.status(200).json({ message: 'Order Updated Successfully!', updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;