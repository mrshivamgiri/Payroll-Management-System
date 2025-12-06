import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem('access_token', response.data.access_token)
      const userRes = await authAPI.me()
      setUser(userRes.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Payroll</h1>
          <p className="text-gray-500 text-sm">Employee & Admin Management</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-300 transition"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-300 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition duration-200"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center text-sm mb-3">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gray-900 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-gray-700 text-sm font-medium mb-4">Demo Accounts</p>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Employee</p>
              <p className="text-sm text-gray-900 font-medium">hire-me@anshumat.org</p>
              <p className="text-xs text-gray-600">HireMe@2025!</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Admin</p>
              <p className="text-sm text-gray-900 font-medium">admin@company.com</p>
              <p className="text-xs text-gray-600">Admin@2025!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
