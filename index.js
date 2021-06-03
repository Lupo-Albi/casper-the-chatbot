'use strict';
// Imports dependencies and set up http server
require('dotenv/config');
require('./initDB')();
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const noticiasRoutes = require('./routes/noticias');
const ExpressError = require('./utils/ExpressError');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/noticias', noticiasRoutes);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
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

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'Something went wrong' } = err;
	if (!err.message) err.message = 'Algo deu errado';
	res.status(statusCode).render('error', { title: 'Error', err });
});

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('app is listening'));
