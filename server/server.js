require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import authMiddleware from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

app.use('/api/users', userRoutes);
