const Noticia = require('../models/noticia');
const catchAsync = require('./catchAsync');

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
	const query = await Noticia.findTen(theme);
	// console.log(query);
	// Checks if the query returned any results
	if (Array.isArray(query) && query.length) {
		const elements = []; // We put each generic template object here to create our carousel

		// Message to be sent to DialogFlow inside the fulfillmentMessages
		const carouselPayload = [
			{
				payload: {
					facebook: {
						attachment: {
							payload: {
								elements, // We put elements array here
								template_type: 'generic'
							},
							type: 'template'
						}
					}
				},
				platform: 'FACEBOOK'
			}
		];

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

		carouselPayload[0].payload.facebook.attachment.payload.elements = elements;
		res.send({ fulfillmentMessages: carouselPayload });
	} else {
		// Send this message if no result was found
		res.send({ fulfillmentMessages: nothingFound });
	}
});

module.exports = getNoticias;
