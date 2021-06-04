const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login form
router.get('/', (req, res) => {
	res.render('user/login', { title: 'Acessar' });
});

router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), (req, res) => {
	req.flash('success', 'Bem-vindo');
	res.redirect('/noticias');
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logout bem sucedido');
	res.redirect('/');
});

module.exports = router;
