const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticiaSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		default: 'https://google.com'
	},
	subtitle: {
		type: String,
		maxLength: 200,
		required: true
	},
	theme: {
		type: String,
		enum: [
			'politica',
			'política',
			'esportes',
			'entretenimento',
			'famosos',
			'Politica',
			'Política',
			'Esportes',
			'Entretenimento',
			'Famosos'
		],
		required: true
	},
	url: { type: String },
	content: { type: String },
	createdTime: {
		type: Date,
		required: true,
		default: Date.now()
	}
});

NoticiaSchema.statics.findTen = function(theme) {
	return this.find({ theme: theme }).sort({ createdTime: -1 }).limit(10);
};

module.exports = mongoose.model('Noticia', NoticiaSchema);
