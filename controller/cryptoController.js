const axios = require('axios');
const CRYPTO= require('../model/cryptoModel');

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

exports.basicController = async(req, res, next)=>{
   const htmlPage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructions Menu</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #f4f4f9;
      }
      h1 {
        text-align: center;
        color: #333;
      }
      .content {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      p {
        font-size: 18px;
        color: #555;
        line-height: 1.6;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .highlight {
        font-weight: bold;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <h1>Welcome to Instructions Menu</h1>
      <p>
        Visit the following links to get information on cryptocurrency stats and deviation.
      </p>
      <p>
        For current stats of a specific coin, visit: 
        <a href="http://54.163.102.84:5000/stats?coin=COIN_NAME" target="_blank">
          http://54.163.102.84:5000/stats?coin=COIN_NAME
        </a>
      </p>
      <p>
        For deviation of a specific coin, visit: 
        <a href="http://54.163.102.84:5000/deviation?coin=COIN_NAME" target="_blank">
          http://54.163.102.84:5000/deviation?coin=COIN_NAME
        </a>
      </p>
      <p>
        <span class="highlight">COIN_NAME</span> is limited to:
        <ul>
          <li>bitcoin</li>
          <li>ethereum</li>
          <li>matic-network</li>
        </ul>
      </p>
    </div>
  </body>
  </html>
  `;

  res.send(htmlPage);   
}
