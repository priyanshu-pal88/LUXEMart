const mongoose = require('mongoose')

async function connectDB() {
   await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database', err);
    }); 
}

module.exports = connectDB;