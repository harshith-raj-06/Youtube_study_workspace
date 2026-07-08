const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const axios = require('axios');

const servicePath = path.join(__dirname, '..', 'src', 'services', 'youtube.service.js');

test('getPlaylistInfo returns playlist metadata from the YouTube playlists endpoint', async () => {
  const originalGet = axios.get;

  axios.get = async (url) => {
    if (url.includes('playlists')) {
      return {
        data: {
          items: [
            {
              id: 'PL123',
              snippet: {
                title: 'Striver DSA Sheet',
                description: 'A complete DSA roadmap',
                thumbnails: {
                  high: { url: 'https://example.com/thumbnail.jpg' }
                },
                channelTitle: 'Striver'
              }
            }
          ]
        }
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  delete require.cache[require.resolve(servicePath)];
  const service = require(servicePath);

  const metadata = await service.getPlaylistInfo('PL123');

  assert.deepEqual(metadata, {
    youtubePlaylistId: 'PL123',
    title: 'Striver DSA Sheet',
    description: 'A complete DSA roadmap',
    thumbnail: 'https://example.com/thumbnail.jpg',
    channelTitle: 'Striver'
  });

  axios.get = originalGet;
});
