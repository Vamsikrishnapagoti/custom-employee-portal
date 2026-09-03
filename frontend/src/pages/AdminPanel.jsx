import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000/api'

function AdminPanel({ onBack }) {
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const loadAdminData = async () => {
    try {
      setLoading(true)

      const [usersResponse, logsResponse] = await Promise.all([
        fetch(`${API_URL}/admin/users`, {
          headers,
        }),
        fetch(`${API_URL}/admin/audit-logs`, {
          headers,
        }),
      ])

      if (!usersResponse.ok || !logsResponse.ok) {
        throw new Error('Unable to load admin data')
      }

      const usersData = await usersResponse.json()
      const logsData = await logsResponse.json()

      setUsers(usersData.users || [])
      setLogs(logsData.logs || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const updateUserRole = async (userId, roleName) => {
  try {
    setMessage('')

    const roleResponse = await fetch(
      `${API_URL}/admin/roles`,
      {
        headers,
      }
    )

    const roleData = await roleResponse.json()

    if (!roleResponse.ok) {
      throw new Error(
        roleData.message || 'Unable to load roles'
      )
    }

    const selectedRole = roleData.roles.find(
      (role) => role.name === roleName
    )

    if (!selectedRole) {
      throw new Error('Selected role not found')
    }

    const response = await fetch(
      `${API_URL}/admin/users/${userId}/role`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          roleId: selectedRole.id,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Unable to update role'
      )
    }

    setMessage('User role updated successfully.')

    await loadAdminData()
  } catch (error) {
    setMessage(error.message)
  }
}

  return (
    <div className="dashboard">

      <header className="navbar">
        <div className="navbar-brand">
          <div className="small-logo">BW</div>

          <div>
            <strong>BrainWave</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </header>

      <main className="dashboard-content">

        <section className="welcome">
          <p className="eyebrow">ADMINISTRATION</p>

          <h1>Admin Control Panel</h1>

          <p>
            Manage employees and monitor system activity.
          </p>
        </section>

        {message && (
          <div className="status-message">
            {message}
          </div>
        )}

        <section className="applications-section">

          <div className="section-header">
            <div>
              <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
              <h2>Users</h2>
            </div>

            <span className="permission-count">
              {users.length} users
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading users...
            </div>
          ) : (
            <div className="app-card">
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeader}>Name</th>
                      <th style={tableHeader}>Email</th>
                      <th style={tableHeader}>Role</th>
                      <th style={tableHeader}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td style={tableCell}>
                          {user.name}
                        </td>

                        <td style={tableCell}>
                          {user.email}
                        </td>

                        <td style={tableCell}>
  <select
    value={user.role}
    onChange={(event) =>
      updateUserRole(user.id, event.target.value)
    }
    style={{
      padding: '7px 10px',
      border: '1px solid #d9deea',
      borderRadius: '7px',
      background: '#fff',
      cursor: 'pointer',
    }}
  >
    <option value="Admin">Admin</option>
    <option value="HR">HR</option>
    <option value="Sales">Sales</option>
    <option value="Support">Support</option>
    <option value="Finance">Finance</option>
  </select>
</td>

                        <td style={tableCell}>
                          {user.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

        <section className="applications-section">

          <div className="section-header">
            <div>
              <p className="eyebrow">SECURITY</p>
              <h2>Audit Logs</h2>
            </div>

            <span className="permission-count">
              {logs.length} records
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading audit logs...
            </div>
          ) : (
            <div className="app-card">
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeader}>Action</th>
                      <th style={tableHeader}>Resource</th>
                      <th style={tableHeader}>Details</th>
                      <th style={tableHeader}>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td style={tableCell}>
                          <strong>{log.action}</strong>
                        </td>

                        <td style={tableCell}>
                          {log.resource}
                        </td>

                        <td style={tableCell}>
                          {log.details}
                        </td>

                        <td style={tableCell}>
                          {new Date(
                            log.created_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

      </main>
    </div>
  )
}

const tableHeader = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #e3e7ef',
  fontSize: '12px',
  color: '#6f788c',
}

const tableCell = {
  padding: '13px 12px',
  borderBottom: '1px solid #eef0f5',
  fontSize: '13px',
}

export default AdminPanel