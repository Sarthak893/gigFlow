
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
dotenv.config();


const app = express();
app.use(cors({ 
    credentials: true, 
    origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));

app.get('/', (req, res) => {
  res.send('GigFlow Backend Running!');
});
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));