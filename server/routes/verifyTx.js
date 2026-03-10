const express = require('express');
const router = express.Router();
const { verifyTx } = require('../controllers/verifyTxController');

// POST /api/verify-tx
// Body: { signature: string, wallet: string }
router.post('/', verifyTx);

module.exports = router;
