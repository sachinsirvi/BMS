require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dbConnect = require('./config/db');

// Route imports
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');
const theatreRouter = require('./routes/theatreRoutes');
const showRouter = require('./routes/showRoutes');
const bookingRouter = require('./routes/bookingRoutes'); 

const app = express();
dbConnect();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());

// rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs   
  message: 'Too many requests from this IP, please try again later.'

  })
app.use('/api/', limiter);

// Dynamic CORS for multiple frontend domains
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://13.210.179.78' // fallback EC2 IP
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// API Routes
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/theatres', theatreRouter);
app.use('/api/shows', showRouter);
app.use('/api/bookings', bookingRouter); 

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Server Start
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
