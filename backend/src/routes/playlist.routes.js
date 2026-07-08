const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
    importPlaylist,
    getPlaylists,
    getPlaylistById,
    deletePlaylist,
    toggleComplete,
    updateNotes,
    toggleBookmark
} = require('../controllers/playlist.controller');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Playlist routes
router.post('/import', importPlaylist);
router.get('/playlists', getPlaylists);
router.get('/playlists/:id', getPlaylistById);
router.delete('/playlists/:id', deletePlaylist);

// Video routes
router.patch('/videos/:id/complete', toggleComplete);
router.patch('/videos/:id/notes', updateNotes);
router.patch('/videos/:id/bookmark', toggleBookmark);

module.exports = router;