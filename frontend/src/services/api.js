const API_URL = 'http://localhost:5000/api'

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password')
  }

  return data
}

export const getApplication = async (application) => {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Authentication required')
  }

  const response = await fetch(`${API_URL}/apps/${application}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Access denied')
  }

  return data
}

export const getZohoApplication = async (application) => {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Authentication required')
  }

  const response = await fetch(`${API_URL}/zoho/${application}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Zoho access denied')
  }

  return data
}

export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}