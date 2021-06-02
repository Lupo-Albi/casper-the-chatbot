const { connect, connection } = require('mongoose');
const { config } = require('dotenv');

module.exports = () => {
	config();
	const uri = process.env.DB_URI;

	connect(uri, {
		dbName: process.env.DB_NAME,
		user: process.env.DB_USER,
		pass: process.env.DB_PASS,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
	// .then(() => {
	// 	console.log('Conexão com o MongoDB estabelecida');
	// })
	// .catch((error) => console.error(error.message));

	const db = connection;
	db.on('error', console.error.bind(console.log, 'Connection error:'));
	db.once('open', () => {
		console.log('Conexão com o MongoDB estabelecida');
	});
};
