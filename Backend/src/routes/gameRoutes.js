const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const protect = require('../middleware/authMiddleWare');

router.post('/create', protect, async (req, res) => {
  const { mode } = req.body;
  const meetingBingoStrings = [/* ...same as before... */];
  const shuffled = meetingBingoStrings.sort(() => 0.5 - Math.random());
  const fields = shuffled.slice(0, 25);
  const game = await Game.create({
    players: [req.user._id],
    creator: req.user._id, 
    fields,
    playerFields: {},
    readyPlayers: [],
    mode,
    started: false,
    finished: false,
  });
  res.json({ gameId: game._id });
});

router.post('/join/:gameId', protect, async (req, res) => {
  const game = await Game.findById(req.params.gameId);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (!game.players.includes(req.user._id)) {
    game.players.push(req.user._id);
    await game.save();
  }
  res.json({ success: true });
});

router.put('/:gameId/fields', protect, async (req, res) => {
  const { fields } = req.body;
  const game = await Game.findById(req.params.gameId);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (!game.started || game.finished) return res.status(400).json({ message: 'Game not started or already finished' });
  game.playerFields.set(req.user._id.toString(), fields);
  await game.save();
  res.json({ success: true });
});

router.post('/start/:gameId', protect, async (req, res) => {
  const game = await Game.findById(req.params.gameId);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (!game.creator.equals(req.user._id)) return res.status(403).json({ message: 'Only creator can start' });
  game.started = true;
  await game.save();
  res.json({ success: true });
});

router.post('/ready/:gameId', protect, async (req, res) => {
  const game = await Game.findById(req.params.gameId);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (!game.readyPlayers.includes(req.user._id)) {
    game.readyPlayers.push(req.user._id);
    await game.save();
  }
  if (game.readyPlayers.length === game.players.length) {
    game.editLocked = true;
    await game.save();
  }
  res.json({ success: true, allReady: game.readyPlayers.length === game.players.length });
});

router.post('/bingo/:gameId', protect, async (req, res) => {
  const game = await Game.findById(req.params.gameId);
  if (!game || game.finished) return res.status(400).json({ message: 'Game not found or already finished' });
  game.winner = req.user._id;
  game.finished = true;
  await game.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { points: 100 } });
  res.json({ success: true });
});

router.get('/list', protect, async (req, res) => {
  const games = await Game.find({ finished: false })
    .populate('players', 'username')
    .populate('winner', 'username')
    .sort({ createdAt: -1 });
  res.json(games);
});

router.get('/:gameId', protect, async (req, res) => {
  const game = await Game.findById(req.params.gameId)
    .populate('players', 'username')
    .populate('creator', 'username') 
    .populate('winner', 'username');
  if (!game) return res.status(404).json({ message: 'Game not found' });
  res.json(game);
});

module.exports = router;