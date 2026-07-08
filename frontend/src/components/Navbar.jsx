import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch (_) {}
    navigate('/login')
  }

  return (
    <nav style={{ background: '#111111', borderBottom: '1px solid #222222' }}>
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-sm tracking-wider" style={{ color: '#22c55e' }}>
          Playlist2Sheet
        </Link>
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded transition-colors"
          style={{ color: '#666666', border: '1px solid #222222' }}
          onMouseEnter={e => { e.target.style.color = '#e8e8e8'; e.target.style.borderColor = '#333333' }}
          onMouseLeave={e => { e.target.style.color = '#666666'; e.target.style.borderColor = '#222222' }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
