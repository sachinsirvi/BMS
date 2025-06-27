const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailHelper = require('../utils/emailHelper');

const registration = async (req, res) => {
    const { name, email, password, role = 'user', isPartner } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    const normalizeEmail = email.toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizeEmail });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists',
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Setup role and partnerStatus
    let finalRole = role;
    let partnerStatus = 'none';
    let messageToSend = 'User registered successfully';

    if (isPartner === true) {
        finalRole = 'partner';
        partnerStatus = 'pending';
        messageToSend =
            'Your partner request is pending admin approval. You will be notified once approved.';
    }

    const user = await userModel.create({
        name,
        email: normalizeEmail,
        password: hashPassword,
        role: finalRole,
        partnerStatus,
    });

    return res.status(201).json({
        success: true,
        message: messageToSend,
    });
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exists, Please register first'
            });
        }

        const correctPassword = await bcrypt.compare(password, existingUser.password)
        if (correctPassword) {
            // Generate JWT token on successful login. Client should store it (e.g., in cookies or localStorage).
            // jwt.sign(payload, secretKey, options)
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            return res.status(200).json({
                success: true,
                message: "Logged In Successfully",
                data: {
                    token,
                    user: {
                        id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
            })
        }
        else {
            res.status(401).json({
                success: false,
                message: "Incorrect password"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// OTP generator & Forgot Password
const otpGenerator = () => Math.floor(100000 + Math.random() * 900000); // ensures 6-digit OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                success: false,
                message: "Email is required"
            });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.send({
                success: false,
                message: "User not found"
            });
        }

        const otp = otpGenerator();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

        // store OTP in DB
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        await emailHelper(
            user.email, 
            {
              name: user.name,
              otp: otp
            },
            "otp.html",
            "OTP Verification - BookMyShow"
          );
          
        res.send({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const {newPassword, otp} = req.body;
        if (!newPassword || !otp){
            return res.send({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await userModel.findOne({otp});
        if (!user){
            return res.send({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (user.otpExpiry < Date.now()){
            return res.send({
                success: false,
                message: "OTP expired"
            });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.send({
            success: true,
            message: "Password reset successfully"
        });

    } catch(err) {
        res.send({
            success: false,
            message: err.message
        });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: 'Current User Authenticated',
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching user"
        });
    }
}

const getAllPartners = async (req, res) => {
    try {
        const adminUser = await userModel.findById(req.userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can view partners'
            });
        }

        const partners = await userModel.find({
            $or: [
                { role: 'partner' },
                { partnerStatus: 'pending' }
            ]
        }).select('-password');

        res.status(200).json({
            success: true,
            message: "Partners fetched successfully",
            data: partners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching partners"
        });
    }
}

const approvePartner = async (req, res) => {
    try {
        const adminUser = await userModel.findById(req.userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can approve partners'
            });
        }

        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = 'partner';
        user.partnerStatus = 'approved';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Partner approved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while approving partner"
        });
    }
}

const rejectPartner = async (req, res) => {
    try {
        const adminUser = await userModel.findById(req.userId);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can reject partners',
            });
        }

        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.partnerStatus = 'none'; // reset the request
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Partner request rejected successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong while rejecting partner',
        });
    }
}
module.exports = { registration, login, forgotPassword, resetPassword, getCurrentUser, getAllPartners, approvePartner, rejectPartner };