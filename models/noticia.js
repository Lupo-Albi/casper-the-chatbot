const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticiaSchema = new Schema({
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
		enum: [ 'politica', 'esportes', 'entretenimento', 'famosos' ],
		required: true
	},
	url: { type: String },
	content: { type: String },
	createdTime: {
		type: Date,
		default: Date.now()
	}
});

noticiaSchema.statics.findTen = function(theme) {
	this.find({ theme: theme }).sort({ createdTime: -1 }).limit(10).then((data) => console.log(data));
};

module.exports = mongoose.model('Noticia', noticiaSchema);
