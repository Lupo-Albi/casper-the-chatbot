'use strict';

// Imports dependencies and set up http server
require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PSID = process.env.PSID;
app.use(bodyParser.json());

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
	let body = req.body;

	let intentName = body.queryResult.intent.displayName;

	if (intentName === 'teste') {
		res.json({
			"fulfillmentMessages": [
				{
					"quickReplies": [
						{
							"content_type": "text",
							"title": "Red",
							"payload": "<POSTBACK_PAYLOAD>",
							"image_url": "https://freepngimg.com/thumb/emoji/1-2-wink-emoji-png-thumb.png"
						},
						{
							"content_type": "text",
							"title": "Green",
							"payload": "<POSTBACK_PAYLOAD>",
							"image_url": "https://freepngimg.com/thumb/emoji/1-2-wink-emoji-png-thumb.png"
						}
					],
					"platform": "FACEBOOK"
				}
			]
		});
	}
});

app.get('/webhook', (req, res) => {
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

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));
