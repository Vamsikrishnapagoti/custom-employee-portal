const express = require('express');

const authenticateToken = require('../middlewares/authMiddleware');
const requirePermission = require('../middlewares/rbacMiddleware');

const router = express.Router();

const applications = {
  people: {
    name: 'Zoho People',
    permission: 'zoho_people_access',
    url: 'https://people.zoho.com',
  },

  crm: {
    name: 'Zoho CRM',
    permission: 'zoho_crm_access',
    url: 'https://www.zoho.com/crm/',
  },

  desk: {
    name: 'Zoho Desk',
    permission: 'zoho_desk_access',
    url: 'https://www.zoho.com/desk/',
  },

  books: {
    name: 'Zoho Books',
    permission: 'zoho_books_access',
    url: 'https://www.zoho.com/books/',
  },
};

router.get(
  '/people',
  authenticateToken,
  requirePermission('zoho_people_access'),
  (req, res) => {
    res.json({
      message: 'Zoho People access granted',
      application: applications.people,
    });
  }
);

router.get(
  '/crm',
  authenticateToken,
  requirePermission('zoho_crm_access'),
  (req, res) => {
    res.json({
      message: 'Zoho CRM access granted',
      application: applications.crm,
    });
  }
);

router.get(
  '/desk',
  authenticateToken,
  requirePermission('zoho_desk_access'),
  (req, res) => {
    res.json({
      message: 'Zoho Desk access granted',
      application: applications.desk,
    });
  }
);

router.get(
  '/books',
  authenticateToken,
  requirePermission('zoho_books_access'),
  (req, res) => {
    res.json({
      message: 'Zoho Books access granted',
      application: applications.books,
    });
  }
);

module.exports = router;
