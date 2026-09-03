const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.password_hash,
      u.is_active,
      r.id AS role_id,
      r.name AS role_name
    FROM Users u
    JOIN UserRoles ur ON u.id = ur.user_id
    JOIN Roles r ON ur.role_id = r.id
    WHERE LOWER(u.email) = LOWER($1)
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0];
};

const getUserPermissions = async (userId) => {
  const result = await pool.query(
    `
    SELECT DISTINCT p.name
    FROM Permissions p
    JOIN RolePermissions rp ON p.id = rp.permission_id
    JOIN UserRoles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = $1
    ORDER BY p.name
    `,
    [userId]
  );

  return result.rows.map((row) => row.name);
};

module.exports = {
  findUserByEmail,
  getUserPermissions,
};