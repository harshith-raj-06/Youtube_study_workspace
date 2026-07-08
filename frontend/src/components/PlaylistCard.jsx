import { useNavigate } from 'react-router-dom'
import { deletePlaylist } from '../services/api'

export default function PlaylistCard({ playlist, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this playlist?')) return
    try {
      await deletePlaylist(playlist._id)
      onDelete(playlist._id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const progress = playlist.progress ?? 0
  const total    = playlist.totalCount ?? 0
  const completed = playlist.completedCount ?? 0

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="group cursor-pointer rounded-lg p-4 flex flex-col gap-3 transition-all"
      style={{
        background: '#111111',
        border: '1px solid #222222',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#22c55e33'
        e.currentTarget.style.background = '#141414'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#222222'
        e.currentTarget.style.background = '#111111'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate" style={{ color: '#e8e8e8' }}>
            {playlist.title || 'Untitled'}
          </h3>
          {playlist.channelTitle && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#555555' }}>
              {playlist.channelTitle}
            </p>
          )}
        </div>
        <span className="text-sm font-bold shrink-0" style={{ color: '#22c55e' }}>
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#444444' }}>
          {completed}/{total} videos completed
        </span>
        <button
          id={`btn-delete-${playlist._id}`}
          onClick={handleDelete}
          className="text-xs px-2 py-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
          style={{ color: '#555555' }}
          onMouseEnter={e => { e.target.style.color = '#ef4444' }}
          onMouseLeave={e => { e.target.style.color = '#555555' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
