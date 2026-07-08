import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  withCredentials: true,   // send cookies on every request
})

// ─── Auth ────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/api/auth/register', data)
export const login    = (data) => api.post('/api/auth/login', data)
export const logout   = ()     => api.post('/api/auth/logout')

// ─── Playlists ────────────────────────────────────────────────────────────────
export const getPlaylists    = ()        => api.get('/yt/playlists')
export const getPlaylistById = (id)      => api.get(`/yt/playlists/${id}`)
export const importPlaylist  = (url)     => api.post('/yt/import', { url })
export const deletePlaylist  = (id)      => api.delete(`/yt/playlists/${id}`)

// ─── Videos ──────────────────────────────────────────────────────────────────
export const toggleComplete  = (id)      => api.patch(`/yt/videos/${id}/complete`)
export const updateNotes     = (id, notes) => api.patch(`/yt/videos/${id}/notes`, { notes })
export const toggleBookmark  = (id)      => api.patch(`/yt/videos/${id}/bookmark`)

export default api
