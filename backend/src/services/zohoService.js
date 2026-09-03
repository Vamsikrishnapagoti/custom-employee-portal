const axios = require('axios')

const ACCOUNTS_URL =
  process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.in'

const API_URL =
  process.env.ZOHO_API_URL || 'https://www.zohoapis.in'

let accessToken = null
let tokenExpiresAt = 0

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  const response = await axios.post(
    `${ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
    }
  )

  accessToken = response.data.access_token

  tokenExpiresAt =
    Date.now() + (response.data.expires_in - 60) * 1000

  return accessToken
}

const zohoRequest = async (method, url, options = {}) => {
  const token = await getAccessToken()

  return axios({
    method,
    url: `${API_URL}${url}`,
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  })
}

module.exports = {
  getAccessToken,
  zohoRequest,
}