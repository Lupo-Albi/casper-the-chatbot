const express = require('express');
const router = express.Router();
const getNoticias = require('../utils/getNoticias');
const getTheme = require('../utils/getTheme'); // Add ou modify themes here

router.post('/', (req, res) => {
	let intentName = req.body.queryResult.intent.displayName;
	// console.log(intentName);
	const theme = getTheme[intentName]();
	getNoticias(req, res, theme);
});

// From Facebook Docs
router.get('/', async (req, res) => {
	// const theme = getTheme['newsEntretenimento']();
	getNoticias(req, res, 'Culinária');
});

module.exports = router;
