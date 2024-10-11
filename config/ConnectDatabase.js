const mongoose = require('mongoose');

const success = (data) =>{console.log(`mongodb successfully connected with server: ${data.connection.host}`)}
const error = (error) =>{console.log(`mongodb failed to connect with server: ${error.message}`)}

const ConnectDatabase = async() =>{
   const Database_URL = process.env.DB_URL || 'mongodb://0.0.0.0:27017/Crypto_KoinX';
   await mongoose.connect(Database_URL).then(success, error);
}

module.exports = ConnectDatabase;