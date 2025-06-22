const mongoose = require('mongoose');

const MeetingBingoFieldSchema = new mongoose.Schema({
    phrase: {
        type: String,
        required: true,
        unique: true 
    }
});

module.exports = mongoose.model('MeetingBingoField', MeetingBingoFieldSchema, 'meetings');
