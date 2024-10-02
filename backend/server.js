require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const db = require('./db');
const adminRoutes = require('./routes/admin');

const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use('/api/admin', adminRoutes);
//configuring CORS for socket.IO
const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});
app.set('io', io);
const cors = require('cors');


io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return next(new Error('Invalid token'));
    }
    socket.user = user;
    next();
  });
});

//configuring CORS for Express routes
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

//Attaching `io` to `req` so it can be accessed in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Importing routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

//Using routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

const { authenticateToken, authorizeRoles } = require('./middleware/auth');

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/api/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

//Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');


    //Join room based on user ID
    socket.join(socket.user.userId.toString());

  

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
