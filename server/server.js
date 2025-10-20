require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const setupSocket = require('./sockets/socket');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { autoGenerateReadings } = require('./controllers/readingController');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const unitRoutes = require('./routes/unitRoutes');
const meterRoutes = require('./routes/meterRoutes');
const readingRoutes = require('./routes/readingRoutes');
const readingAnalyticsRoutes = require('./routes/readingAnalyticsRoutes');
const consumptionSummaryRoutes = require('./routes/consumptionSummaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const server = http.createServer(app);

// Enable middlewares
app.use(cors());
app.use(express.json());

// Initialize socket.io
const io = setupSocket(server);
app.set('io', io);

// Connect to MongoDB and start watching for DB changes
connectDB(io);

// Request logging middleware
app.use((req, res, next) => {
  console.log('🛰️ Received request:', req.method, req.url);
  console.log('📦 Body:', req.body);
  next();
});

// Cron job for daily readings
cron.schedule('0 0 * * *', () => {
  console.log('⏱ Running automatic daily meter reading...');
  autoGenerateReadings({ body: {} }, { status: () => ({ json: console.log }) });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/analytics/readings', readingAnalyticsRoutes);
app.use('/api/consumption-summary', consumptionSummaryRoutes);
app.use('/api/reports', reportRoutes);

// Start server (important: use `server.listen`, not `app.listen`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
