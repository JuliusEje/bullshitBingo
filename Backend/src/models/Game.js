const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fields: [String], 
  playerFields: { type: Map, of: [String], default: {} }, 
  readyPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  mode: { type: String, enum: ['meeting', 'lecture'], default: 'meeting' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  started: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);