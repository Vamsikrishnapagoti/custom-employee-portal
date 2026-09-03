const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const appRoutes = require('./src/routes/appRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const zohoRoutes = require('./src/routes/zohoRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/zoho', zohoRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Custom Employee Portal Backend is running',
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'OK',
      database: 'Connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});