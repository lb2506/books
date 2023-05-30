const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    coverImageURL: {
        type: String,
        required: false
    },
    ageLower: {
        type: Number,
        required: true
    },
    ageUpper: {
        type: Number,
        required: true
    },
    image:
    { type: Object,
        required: true
    },
});

module.exports = mongoose.model('Book', BookSchema);