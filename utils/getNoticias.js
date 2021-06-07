const Noticia = require('../models/noticia');
const catchAsync = require('./catchAsync');

const elements = []; // We put each generic template object here to create our carousel

// Message to be sent to DialogFlow inside the fulfillmentMessages
const carouselPayload = [
	{
		payload: {
			facebook: {
				attachment: {
					payload: {
						// We put elements array here
					}
				}
			}
		},
		platform: 'FACEBOOK'
	}
];

// Messenger Quick Reply Template
const nothingFound = [
	{
		quickReplies: {
			title: 'Desculpa, não encontrei nenhuma notícia sobre esse tema. Quer tentar outro?',
			quickReplies: [ '⚽ Esportes', '👥 Política', '📺 Entretenimento', '🤩 Famosos' ]
		},
		platform: 'FACEBOOK'
	}
];

const getNoticias = catchAsync(async (req, res, theme) => {
	// const query = await Noticia.findTen(theme);
	const query = await Noticia.find({ theme: theme }).limit(1);
	// console.log(query);
	// Checks if the query returned any results
	if (Array.isArray(query) && query.length) {
		query.map((card) => {
			const { title, subtitle, image_url, url } = card;

			const templateCard = {
				title,
				subtitle,
				image_url,
				default_action: {
					type: 'web_url',
					url
				},
				buttons: [
					{
						type: 'web_url',
						url,
						title: 'Visitar site'
					}
				]
			};

			elements.push(templateCard);
		});

		carouselPayload[0].payload.facebook.attachment.payload = elements;
		res.send({ fulfilmentMessages: carouselPayload });
	} else {
		// Send this message if no result was found
		res.send({ fulfilmentMessages: nothingFound });
	}
});

module.exports = getNoticias;
