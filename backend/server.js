
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
dotenv.config();


const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://gig-flow-theta-eight.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  })
);



app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.get('/', (req, res) => {
  res.send('GigFlow Backend Running!');
});
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));