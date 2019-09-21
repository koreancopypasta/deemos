const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.locals.apiKey = process.env.DEEMOS_SECRET;
	res.render('index');
});

module.exports = router;
