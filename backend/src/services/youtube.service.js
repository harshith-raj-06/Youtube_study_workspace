require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.YOUTUBE_API_KEY;

async function getPlaylistInfo(playlistId) {
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`;

    try {
        const playlistResponse = await axios.get(playlistUrl);
        const item = playlistResponse.data.items?.[0];

        if (!item) {
            return null;
        }

        const snippet = item.snippet || {};

        return {
            youtubePlaylistId: item.id || playlistId,
            title: snippet.title || '',
            description: snippet.description || '',
            thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
            channelTitle: snippet.channelTitle || ''
        };
    } catch (error) {
        console.error('Error fetching playlist info:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function fetchPlaylistImportData(playlistId) {
    const playlist = await getPlaylistInfo(playlistId);
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

    try {
        const playlistResponse = await axios.get(playlistItemsUrl);
        const items = playlistResponse.data.items || [];

        if (!items.length) {
            return { playlist, videos: [] };
        }

        const videoIds = items
            .map(item => item.snippet?.resourceId?.videoId)
            .filter(Boolean)
            .join(',');

        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`;
        const videoResponse = await axios.get(videoUrl);
        const videoDetails = videoResponse.data.items || [];

        const formattedVideos = items.map(item => {
            const snippet = item.snippet || {};
            const videoId = snippet.resourceId?.videoId;
            const videoDetail = videoDetails.find(detail => detail.id === videoId);
            const durationRaw = videoDetail?.contentDetails?.duration || '';

            return {
                youtubePlaylistId: snippet.playlistId || playlistId,
                youtubeVideoId: videoId,
                title: snippet.title || '',
                description: snippet.description || '',
                thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
                position: snippet.position ?? 0,
                duration: durationRaw,
                completed: false,
                notes: '',
                bookmarked: false
            };
        });

        return { playlist, videos: formattedVideos };
    } catch (error) {
        console.error('Error fetching playlist data:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function fetchAndFormatPlaylistData(playlistId) {
    const { videos } = await fetchPlaylistImportData(playlistId);
    return videos;
}

module.exports = fetchAndFormatPlaylistData;
module.exports.getPlaylistInfo = getPlaylistInfo;
module.exports.fetchAndFormatPlaylistData = fetchAndFormatPlaylistData;
module.exports.fetchPlaylistImportData = fetchPlaylistImportData;