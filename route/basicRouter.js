const express = require('express');
const router = express.Router();

const { retrieveCryptoData, standardDeviationOfCryto, basicController } = require('../controller/cryptoController.js');

router.route('/').get(basicController);
router.route('/stats').get(retrieveCryptoData);
router.route('/deviation').get(standardDeviationOfCryto);

module.exports = router;