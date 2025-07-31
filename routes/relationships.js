// routes/relationships.js

import express from 'express';
import { getUserRelationships, getTransactionRelationships } from '../controllers/relationshipController.js';

const router = express.Router();

router.get('/user/:id', getUserRelationships);
router.get('/transaction/:id', getTransactionRelationships);

export default router;
