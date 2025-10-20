require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { autoGenerateReadings } = require('./controllers/readingController');

//routes used
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const unitRoutes = require('./routes/unitRoutes');
const meterRoutes = require('./routes/meterRoutes');
const readingRoutes = require('./routes/readingRoutes');
const readingAnalyticsRoutes = require('./routes/readingAnalyticsRoutes');


dotenv.config();

//connect DB
connectDB();

const app = express();

//enable express
app.use(cors())
app.use(express.json());

//console log 
app.use((req, res, next) => {
  console.log('🛰️ Received request:', req.method, req.url);
  console.log('📦 Body:', req.body);
  next();  
});

cron.schedule('0 0 * * *', () => {
  console.log('⏱ Running automatic daily meter reading...');
  autoGenerateReadings({ body: {} }, { 
    status: () => ({ json: console.log }) 
  });
});
//auth route
app.use('/api/auth', authRoutes)
//all routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/analytics/readings', readingAnalyticsRoutes);


//connect a listen to db
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at http:localhost:${PORT}`)
});
