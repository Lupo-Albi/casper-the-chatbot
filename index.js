'use strict';
// Imports dependencies and set up http server
// require('dotenv/config');
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const Noticia = require('./models/noticia');

mongoose.connect('mongodb://localhost:27017/casperApp', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console.log, 'Connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/noticias', async (req, res) => {
	const noticias = await Noticia.find();
	res.render('noticias/index', { title: 'Notícias', noticias });
	// console.log('Get index view');
});

app.get('/noticias/new', (req, res) => {
	res.render('noticias/new', { title: 'Criar nova notícia' });
	// console.log('Get new view')
});

app.get('/noticias/:id', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findById(id);
	res.render('noticias/show', { title: noticia.title, noticia });
	// console.log('Get show view');
});

app.get('/noticias/:id/edit', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findById(id);
	res.render('noticias/edit', { title: 'Editar', noticia });
	// console.log('Get edit view');
});

app.put('/noticias/:id', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia }, { useFindAndModify: false });
	res.redirect(`/noticias/${noticia._id}`);
});

app.post('/noticias', async (req, res) => {
	const noticia = new Noticia(req.body.noticia);
	await noticia.save();
	res.redirect('/noticias');
	// console.log("Post new noticia")
});

app.delete('/noticias/:id', async (req, res) => {
	const { id } = req.params;
	await Noticia.findByIdAndDelete(id);
	res.redirect('/noticias');
});

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

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('app is listening'));
