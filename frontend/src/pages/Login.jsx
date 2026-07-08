import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0a' }}>
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ background: '#111111', border: '1px solid #1e1e1e' }}
      >
        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#22c55e' }}>
            Playlist2Sheet
          </h1>
          <p className="text-xs mt-1" style={{ color: '#444444' }}>
            Track your YouTube progress
          </p>
        </div>

        {error && (
          <div
            className="text-xs rounded px-3 py-2 mb-5"
            style={{ background: '#1a0a0a', border: '1px solid #3a1515', color: '#ef4444' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs" style={{ color: '#555555' }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="rounded px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ background: '#0a0a0a', border: '1px solid #222222', color: '#e8e8e8' }}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#222222'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs" style={{ color: '#555555' }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="rounded px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ background: '#0a0a0a', border: '1px solid #222222', color: '#e8e8e8' }}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#222222'}
            />
          </div>

          <button
            id="btn-login"
            type="submit"
            disabled={loading}
            className="py-2.5 rounded text-sm font-medium mt-1 transition-all"
            style={{
              background: loading ? '#166534' : '#16a34a',
              color: '#ffffff',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#15803d' }}
            onMouseLeave={e => { if (!loading) e.target.style.background = '#16a34a' }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: '#444444' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#22c55e' }} className="hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
