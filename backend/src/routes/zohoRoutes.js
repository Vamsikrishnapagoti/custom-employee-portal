const express = require('express')
const authenticateToken = require('../middlewares/authMiddleware')
const requirePermission = require('../middlewares/rbacMiddleware')
const { zohoRequest } = require('../services/zohoService')

const router = express.Router()

// Zoho People
router.get(
  '/people',
  authenticateToken,
  requirePermission('zoho_people_access'),
  async (req, res) => {
    try {
      const response = await zohoRequest(
        'GET',
        '//people/api/forms/json/employee'
      )

      res.json({
        application: 'Zoho People',
        data: response.data,
      })
    } catch (error) {
      console.error('Zoho People error:', error.response?.data || error.message)
      res.status(502).json({
        message: 'Unable to connect to Zoho People',
      })
    }
  }
)

// Zoho CRM
router.get(
  '/crm',
  authenticateToken,
  requirePermission('zoho_crm_access'),
  async (req, res) => {
    try {
      const response = await zohoRequest(
        'GET',
        '/crm/v8/Accounts'
      )

      res.json({
        application: 'Zoho CRM',
        data: response.data,
      })
    } catch (error) {
      console.error('Zoho CRM error:', error.response?.data || error.message)
      res.status(502).json({
        message: 'Unable to connect to Zoho CRM',
      })
    }
  }
)

// Zoho Books
router.get(
  '/books',
  authenticateToken,
  requirePermission('zoho_books_access'),
  async (req, res) => {
    try {
      const response = await zohoRequest(
        'GET',
        '/books/v3/organizations'
      )

      res.json({
        application: 'Zoho Books',
        data: response.data,
      })
    } catch (error) {
      console.error('Zoho Books error:', error.response?.data || error.message)
      res.status(502).json({
        message: 'Unable to connect to Zoho Books',
      })
    }
  }
)

module.exports = router