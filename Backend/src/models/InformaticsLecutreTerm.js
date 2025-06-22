const mongoose = require('mongoose');

const InformaticsLectureTermSchema = new mongoose.Schema({
    term: {
        type: String,
        required: true,
        unique: true 
    }
});

module.exports = mongoose.model('InformaticsLectureTerm', InformaticsLectureTermSchema, 'lectures');
