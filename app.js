'use strict';
// Imports dependencies and set up http server
require('dotenv/config');
require('./initDB')();
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const app = express();
const noticiasRoutes = require('./routes/noticias');
const webhookRoute = require('./routes/webhook');
const userRoute = require('./routes/users');
// const MongoDBStore = require('connect-mongo');

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'; //randomkeygen

// const store = new MongoDBStore({
// 	url: process.env.DB_URL,
// 	secret,
// 	touchAfter: 24 * 60 * 60
// });

// store.on('error', function(e) {
// 	console.log('Session store error!', e);
// });

// Session
const sessionConfig = {
	// store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1000 ms in a second, 60 seconds in a minute, 60 minutes in an hour, 24 hours in a day and 7 days in a week
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());

// flash
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.use('/noticias', noticiasRoutes);
app.use('/webhook', webhookRoute);
app.use('/', userRoute);

// Error Handling
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
