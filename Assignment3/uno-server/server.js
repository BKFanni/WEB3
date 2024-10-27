// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Game = require('./models/game');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');

// Use the JWT secret and MongoDB URI from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Initialize the `games` object for storing in-memory game data
const games = {}; // Add this line to initialize `games`

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing JSON

// Use the authentication routes with the correct prefix
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware to verify JWT
function verifyToken(token) {
  if (!token) {
    console.error('No token provided');
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token with the secret
    console.log('Token successfully verified:', decoded); // Debug log to check if token is valid
    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err.message); // Log any specific verification errors
    return null;
  }
}


// Socket.io connection handling
io.on('connection', (socket) => {
  // Create Game Event
  socket.on('createGame', async ({ playerName, token }, callback) => {
    const user = verifyToken(token);
    if (!user) {
      console.log('Unauthorized game creation attempt');
      if (typeof callback === 'function') callback(null); // Use the callback safely
      return;
    }
  
    console.log('Creating new game for player:', playerName);
    const gameId = `game-${Date.now()}`;
    
    try {
      const gameState = {
        gameId,
        players: [{ id: socket.id, name: playerName, hand: [] }],
        discardPile: [],
        drawPile: [],
        currentPlayerIndex: 0,
        direction: 1
      };
      console.log('THIS HERe'+ gameState.gameId)
      const newGame = new Game(gameState);
      await newGame.save();
      
      games[gameId] = gameState;
      socket.join(gameId, playerName, token);
      
      if (typeof callback === 'function') callback(gameId); // Ensure callback is called safely
      io.emit('gamesUpdate', games);
      
    } catch (error) {
      console.error('Error during game creation:', error);
      if (typeof callback === 'function') callback(null); // Call the callback with null in case of error
    }
  });
  
  // Join Game Event
  socket.on('joinGame', async ({ gameId, playerName, token }, callback) => {
    console.log('Received joinGame request:');
    console.log('Game ID:', gameId);
    console.log('Player Name:', playerName);
    console.log('Received Token:', token); // Log the received token
    
    if (!token) {
      console.error('No token received on the server'); // Log if token is missing
      if (typeof callback === 'function') callback(null);
      return;
    }

    const user = verifyToken(token);
    if (!user) {
      console.log('Unauthorized game join attempt');
      if (typeof callback === 'function') callback(null);
      return;
    }
  
    try {
      let game = await Game.findOne({ gameId });
      
      if (!game) {
        console.log('Game not found:', gameId);
        if (typeof callback === 'function') callback(null); // Callback if game isn't found
        return;
      }
  
      if (game.players.length < 4) {
        game.players.push({ id: socket.id, name: playerName, hand: [] });
        await game.save();
  
        games[gameId] = game.toObject();
        socket.join(gameId);
        io.to(gameId).emit('gameUpdate', game);
        
        if (typeof callback === 'function') callback(gameId); // Callback with gameId on success
      } else {
        console.log('Game is full');
        if (typeof callback === 'function') callback(null); // Indicate the game is full
      }
    } catch (error) {
      console.error('Error joining game:', error);
      if (typeof callback === 'function') callback(null); // Callback with null in case of error
    }
  });
  
  
  // Update game state in the database
  async function updateGameState(gameId) {
    try {
      const game = await Game.findOne({ gameId });
      if (game) {
        game.players = games[gameId].players;
        game.discardPile = games[gameId].discardPile;
        game.drawPile = games[gameId].drawPile;
        game.currentPlayerIndex = games[gameId].currentPlayerIndex;
        game.direction = games[gameId].direction;
        game.isGameOver = games[gameId].isGameOver;
        await game.save();
      }
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  }
  // Use this function wherever you update game state
  socket.on('playCard', async (gameId, card) => {
    // Existing playCard logic...
    // Assume you have logic here to modify the game state after a card is played.
    
    // After modifying the in-memory game state, save it to the database
    await updateGameState(gameId);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
