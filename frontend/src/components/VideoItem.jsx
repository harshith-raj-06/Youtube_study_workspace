import { useState } from 'react'
import { toggleComplete } from '../services/api'

export default function VideoItem({ video, onToggle, onOpenNotes }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await toggleComplete(video._id)
      onToggle(res.data.video)
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center gap-3 py-3 group"
      style={{ borderBottom: '1px solid #1a1a1a' }}
    >
      {/* Checkbox */}
      <button
        id={`chk-${video._id}`}
        onClick={handleToggle}
        disabled={loading}
        aria-label={video.completed ? 'Mark incomplete' : 'Mark complete'}
        className="w-4 h-4 shrink-0 rounded flex items-center justify-center transition-all"
        style={{
          background: video.completed ? '#22c55e' : 'transparent',
          border: `1.5px solid ${video.completed ? '#22c55e' : '#333333'}`,
          opacity: loading ? 0.5 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {video.completed && (
          <svg className="w-2.5 h-2.5" fill="none" stroke="#000" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className="flex-1 text-sm leading-snug"
        style={{
          color: video.completed ? '#444444' : '#cccccc',
          textDecoration: video.completed ? 'line-through' : 'none',
        }}
      >
        {video.title || `Video ${video.position ?? ''}`}
      </span>

      {/* Notes button */}
      <button
        id={`notes-${video._id}`}
        onClick={() => onOpenNotes(video)}
        className="text-xs px-2 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100 shrink-0"
        style={{
          color: '#22c55e',
          border: '1px solid #14532d',
          background: '#0f2a1a',
        }}
        title="Notes"
      >
        Notes
      </button>
    </div>
  )
}
