
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import transactionRoutes from './routes/transactions.js';
import relationshipRoutes from './routes/relationships.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/relationships', relationshipRoutes);

app.get('/', (req, res) => {
  res.send('User-Transaction Relationship Backend is running.');
  console.log('User-Transaction Relationship Backend is running.');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
