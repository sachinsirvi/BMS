const mongoose = require('mongoose');
const dbURL = process.env.DB_URL;
const dbConnect = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('Connected to DB');
    } catch (err) {
        console.error('DB connection failed:', err.message);
    }
};

module.exports = dbConnect;