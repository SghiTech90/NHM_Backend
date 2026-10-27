
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsOriginCallback, getAllowedOrigins } from './config/cors.js';
import { getPool } from './config/db.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import circleRoutes from './routes/circleRoutes.js';
import districtRoutes from './routes/districtRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import contractorRoutes from './routes/contractorRoutes.js';
import mlampRoutes from './routes/mlampRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import formsRoutes from './routes/formsRoutes.js';



dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(
    cors({
        origin: corsOriginCallback,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/mlamps', mlampRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/forms', formsRoutes);

app.post("/api/test-route", (req, res) => {
    res.json({
        status: "success",
        message: "Server route is working!"
    });
});

// Basic backend test
app.get('/', (req, res) => {
    res.send('NHM Backend is running!');
});

// Database connection test
app.get('/api/health', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(
            'SELECT DB_NAME() AS databaseName'
        );

        res.json({
            status: 'success',
            message: 'Backend and database connected successfully!',
            database: result.recordset[0].databaseName,
        });
    } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Database connection failed. Check the backend terminal.',
        });
    }
});

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`NHM Backend listening on ${HOST}:${PORT}`);
    console.log(`CORS allowed origins: ${getAllowedOrigins().join(', ')}`);
});
