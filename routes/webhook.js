const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Noticia = require('../models/noticia');

let carousel = {
	fulfillmentMessages: [
		{
			payload: {
				facebook: {
					attachment: {
						payload: {
							elements: [],
							template_type: 'generic'
						},
						type: 'template'
					}
				}
			},
			platform: 'FACEBOOK'
		}
	]
};

let genericTemplate = {
	title: 'TITULO',
	subtitle: 'SUBTITULO',
	image_url: 'https://st.depositphotos.com/1000459/2436/i/600/depositphotos_24366251-stock-photo-soccer-ball.jpg',
	default_action: {
		type: 'web_url',
		url:
			'https://globoesporte.globo.com/futebol/selecao-brasileira/noticia/sem-everton-ribeiro-tite-comanda-ultimo-treino-na-granja-antes-de-viagem-para-porto-alegre.ghtml'
	},
	buttons: [
		{
			type: 'web_url',
			url:
				'https://globoesporte.globo.com/futebol/selecao-brasileira/noticia/sem-everton-ribeiro-tite-comanda-ultimo-treino-na-granja-antes-de-viagem-para-porto-alegre.ghtml',
			title: 'Abrir Notícia'
		}
	]
};

router.post('/', (req, res) => {
	let body = req.body;

	let intentName = body.queryResult.intent.displayName;
	console.log(intentName);

	const allIntents = {
		newsPolitica() {
			fulfillmentMessages['payload']['facebook']['attachment']['payload']['elements'].push(genericTemplate);
		},
		newsEsportes() {},
		newsEntretenimento() {},
		newsFamosos() {}
	};

	allIntents[intentName]();
});

// From Facebook Docs
// router.get('/', (req, res) => {
// 	// Your verify token. Should be a random string.
// 	let VERIFY_TOKEN = 'casperbottoken';

// 	// Parse the query params
// 	let mode = req.query['hub.mode'];
// 	let token = req.query['hub.verify_token'];
// 	let challenge = req.query['hub.challenge'];

// 	// Checks if a token and mode is in the query string of the request
// 	if (mode && token) {
// 		// Checks the mode and token sent is correct
// 		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
// 			// Responds with the challenge token from the request
// 			console.log('WEBHOOK_VERIFIED');
// 			res.status(200).send(challenge);
// 		} else {
// 			// Respondes with '403 Forbidden' if verify tokens do not match
// 			res.sendStatus(403);
// 		}
// 	}
// });

module.exports = router;
