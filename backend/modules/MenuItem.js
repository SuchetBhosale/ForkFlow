const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
})

const menuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = menuItem;