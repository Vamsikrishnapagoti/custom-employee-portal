const express = require('express')
const pool = require('../config/db')
const authenticateToken = require('../middlewares/authMiddleware')
const requirePermission = require('../middlewares/rbacMiddleware')

const router = express.Router()

// ==========================================
// GET ALL USERS
// ==========================================
router.get(
  '/users',
  authenticateToken,
  requirePermission('user_manage'),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.name,
          u.email,
          u.is_active,
          COALESCE(
            STRING_AGG(r.name, ', ' ORDER BY r.name),
            'No Role'
          ) AS role
        FROM Users u
        LEFT JOIN UserRoles ur
          ON u.id = ur.user_id
        LEFT JOIN Roles r
          ON ur.role_id = r.id
        GROUP BY
          u.id,
          u.name,
          u.email,
          u.is_active
        ORDER BY u.id
      `)

      res.json({
        users: result.rows,
      })
    } catch (error) {
      console.error('Get users error:', error)

      res.status(500).json({
        message: 'Failed to fetch users',
      })
    }
  }
)

// ==========================================
// GET ALL ROLES
// ==========================================
router.get(
  '/roles',
  authenticateToken,
  requirePermission('role_manage'),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          id,
          name
        FROM Roles
        ORDER BY id
      `)

      res.json({
        roles: result.rows,
      })
    } catch (error) {
      console.error('Get roles error:', error)

      res.status(500).json({
        message: 'Failed to fetch roles',
      })
    }
  }
)

// ==========================================
// UPDATE USER ROLE
// ==========================================
router.put(
  '/users/:userId/role',
  authenticateToken,
  requirePermission('role_manage'),
  async (req, res) => {
    const { userId } = req.params
    const { roleId } = req.body

    if (!roleId) {
      return res.status(400).json({
        message: 'roleId is required',
      })
    }

    try {
      // Check user
      const userResult = await pool.query(
        `
        SELECT id, name
        FROM Users
        WHERE id = $1
        `,
        [userId]
      )

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          message: 'User not found',
        })
      }

      // Check role
      const roleResult = await pool.query(
        `
        SELECT id, name
        FROM Roles
        WHERE id = $1
        `,
        [roleId]
      )

      if (roleResult.rows.length === 0) {
        return res.status(404).json({
          message: 'Role not found',
        })
      }

      // Get previous role
      const previousRoleResult = await pool.query(
        `
        SELECT r.name
        FROM UserRoles ur
        JOIN Roles r
          ON ur.role_id = r.id
        WHERE ur.user_id = $1
        LIMIT 1
        `,
        [userId]
      )

      const previousRole =
        previousRoleResult.rows[0]?.name || 'No Role'

      const newRole = roleResult.rows[0].name

      // Remove existing role
      await pool.query(
        `
        DELETE FROM UserRoles
        WHERE user_id = $1
        `,
        [userId]
      )

      // Assign new role
      await pool.query(
        `
        INSERT INTO UserRoles
          (user_id, role_id)
        VALUES
          ($1, $2)
        `,
        [userId, roleId]
      )

      // Create audit log
      await pool.query(
        `
        INSERT INTO AuditLogs
          (user_id, action, resource, details)
        VALUES
          ($1, $2, $3, $4)
        `,
        [
          req.user.userId,
          'ROLE_UPDATED',
          'User',
          `Changed ${userResult.rows[0].name}'s role from ${previousRole} to ${newRole}`,
        ]
      )

      res.json({
        message: 'User role updated successfully',
      })
    } catch (error) {
      console.error('Update role error:', error)

      res.status(500).json({
        message: 'Failed to update user role',
      })
    }
  }
)

// ==========================================
// GET AUDIT LOGS
// ==========================================
router.get(
  '/audit-logs',
  authenticateToken,
  requirePermission('audit_log_view'),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          a.id,
          a.user_id,
          u.name AS user_name,
          a.action,
          a.resource,
          a.details,
          a.created_at
        FROM AuditLogs a
        LEFT JOIN Users u
          ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `)

      res.json({
        logs: result.rows,
      })
    } catch (error) {
      console.error('Get audit logs error:', error)

      res.status(500).json({
        message: 'Failed to fetch audit logs',
      })
    }
  }
)

module.exports = router