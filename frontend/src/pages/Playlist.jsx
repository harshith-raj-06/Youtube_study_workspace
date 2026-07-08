import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VideoItem from '../components/VideoItem'
import NotesDrawer from '../components/NotesDrawer'
import { getPlaylistById } from '../services/api'

export default function Playlist() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist]       = useState(null)
  const [videos, setVideos]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [notesVideo, setNotesVideo]   = useState(null)

  useEffect(() => { fetchPlaylist() }, [id])

  const fetchPlaylist = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPlaylistById(id)
      setPlaylist(res.data.playlist)
      setVideos(res.data.videos || [])
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login')
      } else {
        setError(err.response?.data?.message || 'Failed to load playlist')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (updated) =>
    setVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)))

  const handleNotesSaved = (updated) => {
    setVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)))
    setNotesVideo(updated)
  }

  const total     = videos.length
  const completed = videos.filter((v) => v.completed).length
  const progress  = total > 0 ? Math.round((completed / total) * 100) : 0

  const Shell = ({ children }) => (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-6">{children}</div>
    </div>
  )

  if (loading) return <Shell><p className="text-sm" style={{ color: '#333333' }}>Loading…</p></Shell>

  if (error) return (
    <Shell>
      <button
        onClick={() => navigate('/dashboard')}
        className="text-xs mb-4 flex items-center gap-1 transition-colors"
        style={{ color: '#444444' }}
        onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
        onMouseLeave={e => e.currentTarget.style.color = '#444444'}
      >
        ← Back to Dashboard
      </button>
      <div className="text-xs rounded px-3 py-2" style={{ background: '#1a0a0a', border: '1px solid #3a1515', color: '#ef4444' }}>
        {error}
      </div>
    </Shell>
  )

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* ← Back */}
        <button
          id="btn-back"
          onClick={() => navigate('/dashboard')}
          className="text-xs flex items-center gap-1.5 w-fit transition-colors"
          style={{ color: '#444444' }}
          onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
          onMouseLeave={e => e.currentTarget.style.color = '#444444'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>

        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8e8e8' }}>
            {playlist?.title || 'Playlist'}
          </h1>
          {playlist?.channelTitle && (
            <p className="text-xs mt-0.5" style={{ color: '#444444' }}>
              {playlist.channelTitle}
            </p>
          )}
        </div>

        {/* Progress card */}
        <div
          className="rounded-lg p-4"
          style={{ background: '#111111', border: '1px solid #1e1e1e' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest" style={{ color: '#444444' }}>
              Progress
            </span>
            <span className="text-sm font-bold" style={{ color: '#22c55e' }}>
              {progress}%
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs mt-2.5" style={{ color: '#333333' }}>
            {completed} of {total} completed
          </p>
        </div>

        {/* Video list */}
        <div
          className="rounded-lg px-4 py-1"
          style={{ background: '#111111', border: '1px solid #1a1a1a' }}
        >
          {videos.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: '#333333' }}>
              No videos in this playlist.
            </p>
          ) : (
            videos.map((video) => (
              <VideoItem
                key={video._id}
                video={video}
                onToggle={handleToggle}
                onOpenNotes={(v) => setNotesVideo(v)}
              />
            ))
          )}
        </div>

      </main>

      {notesVideo && (
        <NotesDrawer
          video={notesVideo}
          onClose={() => setNotesVideo(null)}
          onSaved={handleNotesSaved}
        />
      )}
    </div>
  )
}
