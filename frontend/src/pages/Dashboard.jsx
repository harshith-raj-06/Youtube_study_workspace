import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PlaylistCard from '../components/PlaylistCard'
import { getPlaylists, importPlaylist } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [playlists, setPlaylists]     = useState([])
  const [url, setUrl]                 = useState('')
  const [loading, setLoading]         = useState(true)
  const [importing, setImporting]     = useState(false)
  const [error, setError]             = useState('')
  const [importError, setImportError] = useState('')

  useEffect(() => { fetchPlaylists() }, [])

  const fetchPlaylists = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPlaylists()
      setPlaylists(res.data.playlists || [])
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login')
      } else {
        setError(err.response?.data?.message || 'Failed to load playlists')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setImportError('')
    setImporting(true)
    try {
      const res   = await importPlaylist(url.trim())
      const newPl = res.data.playlist
      const total = res.data.videos?.length ?? 0
      setPlaylists((prev) => {
        const exists = prev.find((p) => p._id === newPl._id)
        if (exists) {
          return prev.map((p) =>
            p._id === newPl._id
              ? { ...newPl, progress: 0, completedCount: 0, totalCount: total }
              : p
          )
        }
        return [{ ...newPl, progress: 0, completedCount: 0, totalCount: total }, ...prev]
      })
      setUrl('')
    } catch (err) {
      setImportError(err.response?.data?.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleDelete = (id) => setPlaylists((prev) => prev.filter((p) => p._id !== id))

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Import Section */}
        <section>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#444444' }}>
            Import Playlist
          </p>
          <form onSubmit={handleImport} className="flex gap-2">
            <input
              id="import-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube playlist URL…"
              className="flex-1 rounded px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ background: '#111111', border: '1px solid #222222', color: '#e8e8e8' }}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#222222'}
            />
            <button
              id="btn-import"
              type="submit"
              disabled={importing}
              className="text-sm font-medium px-5 py-2.5 rounded shrink-0 transition-all"
              style={{
                background: importing ? '#166534' : '#16a34a',
                color: '#ffffff',
                opacity: importing ? 0.7 : 1,
                cursor: importing ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!importing) e.target.style.background = '#15803d' }}
              onMouseLeave={e => { if (!importing) e.target.style.background = '#16a34a' }}
            >
              {importing ? 'Importing…' : 'Import'}
            </button>
          </form>
          {importError && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{importError}</p>
          )}
        </section>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a1a1a' }} />

        {/* Playlists Section */}
        <section>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#444444' }}>
            My Playlists
          </p>

          {loading ? (
            <p className="text-sm" style={{ color: '#333333' }}>Loading…</p>
          ) : error ? (
            <div
              className="text-xs rounded px-3 py-2"
              style={{ background: '#1a0a0a', border: '1px solid #3a1515', color: '#ef4444' }}
            >
              {error}
            </div>
          ) : playlists.length === 0 ? (
            <div
              className="rounded-lg px-4 py-10 text-center"
              style={{ background: '#111111', border: '1px dashed #1e1e1e' }}
            >
              <p className="text-sm" style={{ color: '#333333' }}>
                No playlists yet — import one above.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {playlists.map((pl) => (
                <PlaylistCard key={pl._id} playlist={pl} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
