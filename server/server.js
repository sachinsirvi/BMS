require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');

// Route imports
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');
const theatreRouter = require('./routes/theatreRoutes');
const showRouter = require('./routes/showRoutes');
const bookingRouter = require('./routes/bookingRoutes'); 
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs   
  message: 'Too many requests from this IP, please try again later.'

  })

const app = express();
dbConnect();

// CORS setup for frontend
app.use(cors({
  origin: 'https://bms-client-nrh5.onrender.com',
  credentials: true,
}));

app.use(express.json());
app.use('/api/', limiter);

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://my-frontend-domain.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

//sanitize user input to prevent mongodb operator injection
//app.use(mongoSanitize());

// API Routes
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/theatres', theatreRouter);
app.use('/api/shows', showRouter);
app.use('/api/bookings', bookingRouter); 

// Server Start
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
