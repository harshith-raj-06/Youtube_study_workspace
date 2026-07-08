const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    youtubePlaylistId: {
        type: String,
        required: true,
        index: true
    },
    title: String,
    description: String,
    thumbnail: String,
    channelTitle: String,
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'video'
    }]
}, {
    timestamps: true
});

const playlistModel = mongoose.model('playlist', playlistSchema);

module.exports = playlistModel;