require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//routes used
const userRoutes = require('./routes/userRoutes');

dotenv.config();

//connect DB
connectDB();

const app = express();

//enable express
app.use(cors())
app.use(express.json());

//all routes
app.use('/api/users', userRoutes);

//connect a listen to db
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at http:localhost:${PORT}`)
});
