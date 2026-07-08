const fetchPlaylist = require("../services/youtube.service");
const Playlist = require("../models/playlist.model");
const Video = require("../models/video.model");

function extractPlaylistId(url) {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
}

// POST /yt/import
async function importPlaylist(req, res) {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ message: "Playlist URL is required" });
        }

        const playlistId = extractPlaylistId(url);

        if (!playlistId) {
            return res.status(400).json({ message: "Invalid playlist URL" });
        }

        const importData = await fetchPlaylist.fetchPlaylistImportData(playlistId);

        // Each user gets their own copy of the playlist
        let playlistDoc = await Playlist.findOne({
            youtubePlaylistId: playlistId,
            user: req.user.id
        });

        if (playlistDoc) {
            // Refresh metadata
            playlistDoc.title = importData.playlist?.title || '';
            playlistDoc.description = importData.playlist?.description || '';
            playlistDoc.thumbnail = importData.playlist?.thumbnail || '';
            playlistDoc.channelTitle = importData.playlist?.channelTitle || '';
            await Video.deleteMany({ playlist: playlistDoc._id });
        } else {
            playlistDoc = new Playlist({
                user: req.user.id,
                youtubePlaylistId: playlistId,
                title: importData.playlist?.title || '',
                description: importData.playlist?.description || '',
                thumbnail: importData.playlist?.thumbnail || '',
                channelTitle: importData.playlist?.channelTitle || ''
            });
        }

        const savedVideos = await Promise.all(
            importData.videos.map(video =>
                Video.create({ ...video, playlist: playlistDoc._id })
            )
        );

        playlistDoc.videos = savedVideos.map(v => v._id);
        await playlistDoc.save();

        return res.status(200).json({ playlist: playlistDoc, videos: savedVideos });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// GET /yt/playlists
async function getPlaylists(req, res) {
    try {
        const playlists = await Playlist.find({ user: req.user.id }).lean();

        // Attach progress to each playlist
        const withProgress = await Promise.all(
            playlists.map(async (pl) => {
                const total = pl.videos.length;
                if (total === 0) return { ...pl, progress: 0, completedCount: 0, totalCount: 0 };

                const completedCount = await Video.countDocuments({
                    playlist: pl._id,
                    completed: true
                });

                return {
                    ...pl,
                    progress: Math.round((completedCount / total) * 100),
                    completedCount,
                    totalCount: total
                };
            })
        );

        return res.status(200).json({ playlists: withProgress });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// GET /yt/playlists/:id
async function getPlaylistById(req, res) {
    try {
        const playlist = await Playlist.findOne({
            _id: req.params.id,
            user: req.user.id
        }).lean();

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const videos = await Video.find({ playlist: playlist._id }).sort({ position: 1 });

        const total = videos.length;
        const completedCount = videos.filter(v => v.completed).length;
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return res.status(200).json({
            playlist: {
                ...playlist,
                progress,
                completedCount,
                totalCount: total
            },
            videos
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// DELETE /yt/playlists/:id
async function deletePlaylist(req, res) {
    try {
        const playlist = await Playlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        await Video.deleteMany({ playlist: playlist._id });

        return res.status(200).json({ message: "Playlist deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// PATCH /yt/videos/:id/complete
async function toggleComplete(req, res) {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) return res.status(404).json({ message: "Video not found" });

        // Verify ownership via playlist
        const playlist = await Playlist.findOne({ _id: video.playlist, user: req.user.id });
        if (!playlist) return res.status(403).json({ message: "Forbidden" });

        video.completed = !video.completed;
        await video.save();

        return res.status(200).json({ video });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// PATCH /yt/videos/:id/notes
async function updateNotes(req, res) {
    try {
        const { notes } = req.body;

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        const playlist = await Playlist.findOne({ _id: video.playlist, user: req.user.id });
        if (!playlist) return res.status(403).json({ message: "Forbidden" });

        video.notes = notes ?? video.notes;
        await video.save();

        return res.status(200).json({ video });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// PATCH /yt/videos/:id/bookmark
async function toggleBookmark(req, res) {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        const playlist = await Playlist.findOne({ _id: video.playlist, user: req.user.id });
        if (!playlist) return res.status(403).json({ message: "Forbidden" });

        video.bookmarked = !video.bookmarked;
        await video.save();

        return res.status(200).json({ video });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    importPlaylist,
    getPlaylists,
    getPlaylistById,
    deletePlaylist,
    toggleComplete,
    updateNotes,
    toggleBookmark
};