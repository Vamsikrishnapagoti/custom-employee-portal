import React, { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')

      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      return null
    }
  })

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  )
}

export default App