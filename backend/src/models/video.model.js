const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlist',
        required: true
    },
    youtubePlaylistId: {
        type: String,
        required: true,
        index: true
    },
    youtubeVideoId: {
        type: String,
        required: true,
        index: true
    },
    title: String,
    description: String,
    thumbnail: String,
    duration: String,
    position: Number,
    completed: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ''
    },
    bookmarked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const videoModel = mongoose.model('video', videoSchema);

module.exports = videoModel;