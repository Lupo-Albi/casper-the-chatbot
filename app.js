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
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
const noticiasRoutes = require('./routes/noticias');
const webhookRoute = require('./routes/webhook');
const userRoute = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize());

const secret = process.env.SECRET;

// Session
const sessionConfig = {
	name: 'casperSession',
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
	res.locals.currentUser = req.user;
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
app.use('/noticias', noticiasRoutes); // Dashboard
app.use('/webhook', webhookRoute); // For Dialogflow
app.use('/', userRoute); // Login page

// Error Handling
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'Algo deu errado' } = err;
	if (!err.message) err.message = 'Algo deu errado';
	res.status(statusCode).render('error', { title: 'Error', err });
});

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('app is listening'));
