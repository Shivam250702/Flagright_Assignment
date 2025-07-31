// routes/users.js

import express from 'express';
import { addOrUpdateUser, listUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/', addOrUpdateUser);
router.get('/', listUsers);

export default router;
