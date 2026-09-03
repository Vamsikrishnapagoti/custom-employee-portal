import React, { useState } from 'react'
import AdminPanel from './AdminPanel'
import { getZohoApplication } from '../services/api'

const applications = [
  {
    key: 'people',
    permission: 'zoho_people_access',
    name: 'Zoho People',
    description: 'Employee management and HR services',
    icon: '👥',
  },
  {
    key: 'crm',
    permission: 'zoho_crm_access',
    name: 'Zoho CRM',
    description: 'Customer relationship management',
    icon: '📊',
  },
  {
    key: 'desk',
    permission: 'zoho_desk_access',
    name: 'Zoho Desk',
    description: 'Customer support and ticket management',
    icon: '🎧',
  },
  {
    key: 'books',
    permission: 'zoho_books_access',
    name: 'Zoho Books',
    description: 'Accounting and financial management',
    icon: '💰',
  },
]

function Dashboard({ user, onLogout }) {
  const [message, setMessage] = useState('')
  const [loadingApp, setLoadingApp] = useState('')
  const [showAdmin, setShowAdmin] = useState(false)

  const permissions = user?.permissions || []

  const hasPermission = (permission) => {
    return permissions.includes(permission)
  }

  const openApplication = async (app) => {
    setMessage('')
    setLoadingApp(app.key)

    try {
      const data = await getZohoApplication(app.key)

      if (data.application?.url) {
        window.open(data.application.url, '_blank')
      } else {
        setMessage(`${app.name} access granted.`)
      }
    } catch (error) {
      setMessage(error.message || 'Access denied')
    } finally {
      setLoadingApp('')
    }
  }

  const visibleApplications = applications.filter((app) =>
    hasPermission(app.permission)
  )

  // Only Admin can open the Admin Panel
  if (showAdmin && user?.role === 'Admin') {
    return (
      <AdminPanel
        onBack={() => setShowAdmin(false)}
      />
    )
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="navbar-brand">
          <div className="small-logo">BW</div>

          <div>
            <strong>BrainWave</strong>
            <span>Employee Portal</span>
          </div>
        </div>

        <div className="user-area">
          <div className="user-info">
            <strong>{user?.name || 'Employee'}</strong>
            <span>{user?.role || 'User'}</span>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome">
          <p className="eyebrow">EMPLOYEE PORTAL</p>

          <h1>
            Welcome, {user?.name || 'Employee'}
          </h1>

          <p>
            Access the applications available for your role.
          </p>

          <div className="role-badge">
            Role: <strong>{user?.role || 'User'}</strong>
          </div>
        </section>

        {message && (
          <div className="status-message">
            {message}
          </div>
        )}

        <section className="applications-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">
                AUTHORIZED SERVICES
              </p>

              <h2>Your Applications</h2>
            </div>

            <span className="permission-count">
              {visibleApplications.length} application
              {visibleApplications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {visibleApplications.length > 0 ? (
            <div className="app-grid">
              {visibleApplications.map((app) => (
                <div
                  className="app-card"
                  key={app.key}
                >
                  <div className="app-icon">
                    {app.icon}
                  </div>

                  <div className="app-card-content">
                    <h3>{app.name}</h3>

                    <p>{app.description}</p>

                    <div className="access-label">
                      ✓ Authorized
                    </div>

                    <button
                      className="app-button"
                      onClick={() => openApplication(app)}
                      disabled={loadingApp === app.key}
                    >
                      {loadingApp === app.key
                        ? 'Opening...'
                        : 'Open Application →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div>🔒</div>

              <h3>No applications available</h3>

              <p>
                Your role currently has no application permissions.
              </p>
            </div>
          )}
        </section>

        {user?.role === 'Admin' && (
          <section className="admin-panel">
            <div className="admin-icon">
              ⚙️
            </div>

            <div className="admin-content">
              <p className="eyebrow">
                ADMINISTRATION
              </p>

              <h2>Admin Controls</h2>

              <p>
                Manage users, roles, permissions and audit logs.
              </p>
            </div>

            <button
              className="admin-button"
              onClick={() => setShowAdmin(true)}
            >
              Open Admin Panel →
            </button>
          </section>
        )}

        <section className="security-note">
          <span>🔐</span>

          <div>
            <strong>
              Secure Role-Based Access
            </strong>

            <p>
              Application access is verified by the backend
              using JWT authentication and role-based permissions.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard