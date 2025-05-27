// Express setup
const express = require("express");
const app = express();

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://johnnothing:jeparlefrancaistresbien@joaoupskill.lf046.mongodb.net/Património');
const db = mongoose.connection;
db.on('error', (error) => console.error("Connection error:", error));
db.once('open', () => console.log("Connected to Database"));
// Middleware
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Routes
const authRoutes = require('./src/routes/authRoutes'); 
app.use('/api/auth', authRoutes);

const storeRoutes = require('./src/routes/storeRoutes'); 
app.use('/api/stores', storeRoutes);

const vehicleRoutes = require('./src/routes/vehicleRoutes'); 
app.use('/api/vehicles', vehicleRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("App running on port " + port));
