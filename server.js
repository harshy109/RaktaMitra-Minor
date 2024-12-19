const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
// const donationRoutes = require('./routes/donationRoutes');

dotenv.config();
//connectDB();
connectDB().catch(error => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });


const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
// app.use('/api/donations', donationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));