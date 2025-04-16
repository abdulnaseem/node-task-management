require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

//middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://task-management-nine-taupe.vercel.app'
    ]
}));
app.use(express.json());

//database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("MongoDB connection error: ", error));

//routes
app.use('/api/tasks', taskRoutes);

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})