const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const { Server } = require('socket.io');

const authorization = require('./routes/authRoute');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const billRoutes = require('./routes/billRoutes')
const requestRoutes = require('./routes/requestRoutes')

const app = express();
const PORT = process.env.PORT || 5017;

// Create an HTTP server and attach the Express app
const server = require('http').createServer(app);

// Create a Socket.IO instance and attach it to the HTTP server
const io = new Server(server);

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authorization);
app.use('/api/product/', productRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/bill', billRoutes)
app.use('/api', requestRoutes)

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
