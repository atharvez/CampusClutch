const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/competitions', require('./routes/competitions'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/projects', require('./routes/projects'));

// Basic route
app.get('/', (req, res) => {
  res.send('CampusClutch API is running...');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  socket.on('joinTeam', ({ teamId }) => {
    socket.join(teamId);
    console.log(`User joined team: ${teamId}`);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.teamId).emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User has left');
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
