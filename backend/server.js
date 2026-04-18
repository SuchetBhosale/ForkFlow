const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const userRoutes = require('./routes/userRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

const PORT = 5000;

const app = express();

mongoose.connect(MONGO_URI).then(()=>console.log("MongoDB server connected!"));

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/menuItem', menuItemRoutes);

app.listen(PORT,()=>console.log("Server Started!"));