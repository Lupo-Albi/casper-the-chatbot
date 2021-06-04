const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/', (req, res) => {
	let body = req.body;

	let intentName = body.queryResult.intent.displayName;

	const allIntents = {
		newsPolitica() {
			res.json({
				fulfillmentMessages: [
					{
						quickReplies: {
							title: 'Resposta Rápida dentro do intent',
							quickReplies: [ 'Esportes', 'Política', 'Entretenimento', 'Famosos' ]
						},
						platform: 'FACEBOOK'
					},
					{
						text: {
							text: [ 'Dummy Text' ]
						}
					}
				]
			});
		},
		newsEsportes() {},
		newsEntretenimento() {},
		newsFamosos() {}
	};

	allIntents[intentName]();
});

// From Facebook Docs
router.get('/', (req, res) => {
	// Your verify token. Should be a random string.
	let VERIFY_TOKEN = 'casperbottoken';

	// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	// Checks if a token and mode is in the query string of the request
	if (mode && token) {
		// Checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			// Respondes with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});

module.exports = router;
