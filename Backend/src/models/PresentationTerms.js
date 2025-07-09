const mongoose = require('mongoose');

const PresentationTerms = new mongoose.Schema({
    phrase: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('PresentationTerms', PresentationTerms, 'presentation');
