import { useState, useEffect } from 'react'
import { updateNotes } from '../services/api'

export default function NotesDrawer({ video, onClose, onSaved }) {
  const [notes, setNotes]   = useState(video?.notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    setNotes(video?.notes || '')
    setSaved(false)
  }, [video])

  if (!video) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateNotes(video._id, notes)
      onSaved(res.data.video)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving notes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-80 z-50 flex flex-col"
        style={{ background: '#111111', borderLeft: '1px solid #222222' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid #1a1a1a' }}
        >
          <span className="font-medium text-sm truncate flex-1 mr-2" style={{ color: '#e8e8e8' }}>
            {video.title || 'Video'}
          </span>
          <button
            id="btn-close-notes"
            onClick={onClose}
            style={{ color: '#555555' }}
            onMouseEnter={e => e.target.style.color = '#e8e8e8'}
            onMouseLeave={e => e.target.style.color = '#555555'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <label className="text-xs font-medium uppercase tracking-widest" style={{ color: '#444444' }}>
            Notes
          </label>
          <textarea
            id="notes-textarea"
            className="flex-1 resize-none rounded p-3 text-sm focus:outline-none"
            style={{
              background: '#0a0a0a',
              border: '1px solid #222222',
              color: '#cccccc',
            }}
            placeholder="Add your notes here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#22c55e'}
            onBlur={e => e.target.style.borderColor = '#222222'}
          />
          <button
            id="btn-save-notes"
            onClick={handleSave}
            disabled={saving}
            className="py-2 rounded text-sm font-medium transition-all"
            style={{
              background: saved ? '#166534' : '#16a34a',
              color: '#ffffff',
              opacity: saving ? 0.6 : 1,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}
