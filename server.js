const express = require('express');
const app = express();

// configure environment variables  
const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

// configure database 
const connectDatabase = require('./config/ConnectDatabase.js');
connectDatabase();

// attach router
const basicRouter = require('./route/basicRouter.js');
app.use('/', basicRouter);

// start server 
const PORT = process.env.PORT || 5000; 
const MACHINE = process.env.IP_V4 || "localhost"; 
app.listen(PORT, ()=>{
   console.log(`listening on http://${MACHINE}:${PORT}`);
})

// retrieve data for every 2 hours
const axios = require('axios');
const CRYPTO = require('./model/cryptoModel.js');
setInterval(async()=>{
   const coins = ["bitcoin", "matic-network", "ethereum"];
   for( let coin of coins ){
      const url = `http://${MACHINE}:${PORT}/stats?coin=${coin}`;
      let crypto = await CRYPTO.findOne({"coin": {$regex: coin}});
      if(!crypto) crypto = await CRYPTO.create({coin});
      
      const addToDatabase = async(response)=>{
         const data = response.data;
         // console.log(crypto, data);
         
         crypto.history.price.push(data.price);
         crypto.history.marketCap.push(data.marketCap);
         crypto.history['24hChange'].push(data['24hChange']);
         await CRYPTO.findByIdAndUpdate(crypto.id, crypto);
      }
      await axios.get(url).then(addToDatabase, console.error);
      setTimeout(()=>{},2000);
   }

   console.log("retrieved and stored data");
}, 2*60*60*1000); // 2*60*60*1000 - every 2 hours