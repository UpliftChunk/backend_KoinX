const mongoose = require('mongoose');

const cryptoModel = new mongoose.Schema({
   coin: {
      type: String,
      required: true
   },
   history: {
      type: {
         "price": {
            type: Array,
            default: []
         },
         "marketCap": {
            type: Array,
            default: []
         },
         "24hChange": {
            type: Array,
            default: []
         }
      }, 
      default: {}
   }
});

module.exports= mongoose.model('CryptoHistory', cryptoModel);