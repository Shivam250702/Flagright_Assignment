// routes/transactions.js

import express from 'express';
import { addOrUpdateTransaction, listTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', addOrUpdateTransaction);
router.get('/', listTransactions);

export default router;
