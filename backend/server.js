const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const userRoutes = require('./routes/userRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require("./routes/aiRoutes");
const http = require('http');
const { Server } = require('socket.io');
const socket = require('./socket');

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (clientSocket) => {
    console.log('User connected:', clientSocket.id);

    clientSocket.on('disconnect', () => {
        console.log('User disconnected');
    });
})

socket.setIO(io);

app.use(cors());

mongoose.connect(MONGO_URI).then(() => console.log("MongoDB server connected!"));

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/menuItem', menuItemRoutes);

app.use('/api/orders', orderRoutes);

app.use("/api/ai", aiRoutes);

server.listen(PORT, () => console.log("Server Started!"));