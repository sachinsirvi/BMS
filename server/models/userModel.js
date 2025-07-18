const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'partner'],
        required: true,
        default: 'user'
    },
    partnerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved'],
        default: 'none'
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;