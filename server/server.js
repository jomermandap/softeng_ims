const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const authorization = require('./routes/authRoute');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const billRoutes = require('./routes/billRoutes')

const app = express();
const PORT = process.env.PORT || 5017;

// Create an HTTP server and attach the Express app
const server = require('http').createServer(app);

// Create a Socket.IO instance and attach it to the HTTP server
const io = new Server(server);

app.use(cors());
app.use(express.json());

// Update the connection string
const uri = "mongodb+srv://imsenvirotech2025:XGVdjdf5oaf3uaiV@cluster0.16kky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authorization);
app.use('/api/product/', productRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/bill', billRoutes)

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});