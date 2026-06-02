import express from 'express';

import {
  getAdminStats,
  getTopUsers,
  getActivities,
  getCategoryStats,
  getUserGrowth,
  getFraudAlerts,
} from '../controllers/admin.controller.js';

import {
  protect,
} from '../middleware/auth.middleware.js';
import { getAllUsers, deleteUser } from '../controllers/admin.controller.js';
import { getAllExpenses } from '../controllers/admin.controller.js';
import { getLogs } from '../controllers/log.controller.js';

const router = express.Router();
// ================= ALL USERS =================



// ================= ADMIN STATS =================

router.get(
  '/stats',
  protect,
  getAdminStats
);
router.get('/logs', getLogs);
// ================= ALL USERS =================

router.get('/users', protect, getAllUsers);

router.delete('/users/:id', protect, deleteUser);
// ================= ALL EXPENSES =================
router.get('/expenses', protect, getAllExpenses);

// ================= TOP USERS =================

router.get(
  '/top-users',
  protect,
  getTopUsers
);

// ================= ACTIVITIES =================

router.get(
  '/activities',
  protect,
  getActivities
);

// ================= CATEGORY ANALYTICS =================

router.get(
  '/categories',
  protect,
  getCategoryStats
);

// ================= USER GROWTH =================

router.get(
  '/growth',
  protect,
  getUserGrowth
);

// ================= FRAUD ALERTS =================

router.get(
  '/fraud-alerts',
  protect,
  getFraudAlerts
);

export default router;