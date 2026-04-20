const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      items: {
        type: Array,
         qty: Number
      },
      totalPrice: {
        type: Number
      },
      status: {
        type: String,
        default: "new"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;