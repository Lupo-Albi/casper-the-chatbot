const express = require('express');
const router = express.Router();
const passport = require('passport');
// const User = require('../models/user');
// const catchAsync = require('../utils/catchAsync');

// Register form
// router.get('/register', (req, res) => {
// 	res.render('users/register', { title: 'Registrar' });
// });

// router.post(
// 	'/register',
// 	catchAsync(async (req, res) => {
// 		try {
// 			const { username, password } = req.body;
// 			const user = new User({ username });
// 			const registeredUser = await User.register(user, password);
// 			console.log(registeredUser);
// 			req.flash('success', 'Cadastro bem sucedido');
// 			res.redirect('/noticias');
// 		} catch (e) {
// 			req.flash('error', e.message);
// 			res.redirect('/register');
// 		}
// 	})
// );

// Login form
router.get('/', (req, res) => {
	res.render('users/login', { title: 'Acessar' });
});

router.post(
	'/',
	passport.authenticate('local', {
		successRedirect: '/noticias',
		successFlash: 'Bem-vindo',
		failureFlash: 'Senha ou Usuário inválidos',
		failureRedirect: '/'
	}),
	(req, res) => {}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logout bem sucedido');
	res.redirect('/');
});

module.exports = router;
