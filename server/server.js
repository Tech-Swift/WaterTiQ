require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//routes used
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const unitRoutes = require('./routes/unitRoutes');

dotenv.config();

//connect DB
connectDB();

const app = express();

//enable express
app.use(cors())
app.use(express.json());

//auth route
app.use('/api/auth', authRoutes)
//all routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);

//connect a listen to db
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at http:localhost:${PORT}`)
});
