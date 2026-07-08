import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#0a0a0a',
    border: '1px solid #222222',
    color: '#e8e8e8',
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
            Create your account
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
          {[
            { id: 'reg-username', name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
            { id: 'reg-email',    name: 'email',    label: 'Email',    type: 'email', placeholder: 'you@example.com' },
            { id: 'reg-password', name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ id, name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-xs" style={{ color: '#555555' }}>{label}</label>
              <input
                id={id}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                placeholder={placeholder}
                className="rounded px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = '#222222'}
              />
            </div>
          ))}

          <button
            id="btn-register"
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
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: '#444444' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#22c55e' }} className="hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
