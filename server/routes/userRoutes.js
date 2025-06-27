const express = require('express');
const auth = require('../middlewares/authMiddleware');
const userRouter = express.Router();
const { registration, login, forgotPassword, resetPassword, getCurrentUser, getAllPartners, approvePartner, rejectPartner} = require('../controllers/userController');

// User Registration
userRouter.post('/register', registration);

// User Login
userRouter.post('/login', login);

// forgot password
userRouter.patch('/forgot-password', forgotPassword);

// Reset Password
userRouter.patch('/reset-password', resetPassword);

// Get Current User
userRouter.get('/get-current-user', auth, getCurrentUser);

// Get all partners (pending + approved)
userRouter.get('/get-all-partners', auth, getAllPartners);

// Approve a partner
userRouter.post('/approve-partner', auth, approvePartner);

// Reject a partner
userRouter.post('/reject-partner', auth, rejectPartner);

module.exports = userRouter;