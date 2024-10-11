const axios = require('axios');
const CRYPTO= require('../model/cryptoModel');
exports.basicController = async(req, res, next)=>{
   const url = 'https://api.coingecko.com/api/v3/ping';
   await axios.get(url).then((response)=>{
      console.log(response.data)
      res.json(response.data);
   }, console.error);
   res.send("some error");
}
exports.retrieveCryptoData = async(req, res, next)=>{
   const id= req.query?.coin || "bitcoin";
   const payload = {};
   const url = `https://api.coingecko.com/api/v3/coins/${id}`;
   await axios.get(url).then((response)=>{
      let data= (response.data);
      payload.price = data.market_data.current_price.usd;
      payload.marketCap = data.market_data.market_cap.usd;
      payload["24hChange"] = data.market_data.price_change_24h;
   
   }, console.error);

   res.send(payload);
}

exports.standardDeviationOfCryto = async(req, res, next)=>{
   const coin = req.query.coin || "radafasdf";
   const crypto = await CRYPTO.findOne({"coin": {$regex: coin}});
   if(!crypto) return res.status(404).json({"message": "coin not found"});

   let {price} = crypto.history;
   price = price.slice(0, 100);
   const length = (price.length?price.length: 1);
   const mean = price.reduce((total,num)=>total+num,0)/length;
   const variance = price.reduce((total,num)=>(total + (num - mean)**2), 0)/length;
   const standardDeviation = Math.sqrt(variance);
   // console.log(mean, variance, standardDeviation, price);
   res.json({
      deviation: standardDeviation
   })

}
