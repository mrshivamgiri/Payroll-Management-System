import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-light text-gray-900">Payroll</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <span className="bg-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs font-medium">
              {user?.role === 'admin' ? '👔 Admin' : '👤 Employee'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
