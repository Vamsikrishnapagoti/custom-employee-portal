# BrainWave Custom Employee Portal

A secure, role-based employee portal built for the BrainWave assignment using React.js, Node.js/Express.js, PostgreSQL, JWT authentication, RBAC, and Zoho One integration.

The portal allows employees to access Zoho applications according to their assigned role. Administrators can manage employee roles and monitor administrative activity through audit logs.

---

## 1. Project Overview

The BrainWave Custom Employee Portal provides a centralized interface for employees to access authorized business applications.

The system is designed around three main principles:

- Secure authentication using JWT
- Backend-enforced Role-Based Access Control (RBAC)
- Backend-only Zoho OAuth integration

Employees do not enter or manage Zoho credentials. The backend handles authentication with Zoho and controls access to the available applications.

---

## 2. Application Flow

```text
Employee
   |
   v
React Login Page
   |
   | POST /api/auth/login
   v
Express Backend
   |
   +---- Verify Password
   |
   +---- Get User Role
   |
   +---- Get Permissions
   |
   +---- Generate JWT
   |
   v
React Dashboard
   |
   | Display authorized applications
   v
Employee selects application
   |
   | JWT
   v
Express Backend
   |
   +---- JWT Authentication
   |
   +---- RBAC Permission Check
   |
   v
Zoho OAuth Service
   |
   v
Zoho API