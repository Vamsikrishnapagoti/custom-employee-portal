const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  findUserByEmail,
  getUserPermissions,
} = require('../models/userModel');

const pool = require('../config/db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await findUserByEmail(email);

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      await pool.query(
        `
        INSERT INTO AuditLogs (user_id, action, resource, details)
        VALUES ($1, $2, $3, $4)
        `,
        [
          user.id,
          'LOGIN_FAILED',
          'AUTHENTICATION',
          'Invalid password',
        ]
      );

      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const permissions = await getUserPermissions(user.id);

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      }
    );

    await pool.query(
      `
      INSERT INTO AuditLogs (user_id, action, resource, details)
      VALUES ($1, $2, $3, $4)
      `,
      [
        user.id,
        'LOGIN_SUCCESS',
        'AUTHENTICATION',
        'User logged in successfully',
      ]
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        permissions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  login,
};
