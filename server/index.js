const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); 
const userRouter = require('./routes/userRouter');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/Categories');

dotenv.config();

const app = express();
const PORT = 8000;  

app.use(express.json()); 
app.use(cors()); 
const mongoURI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
})
.catch(err => {
    console.error('DB connection error:', err);
});

// Use routes
app.use('/api', userRouter);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
