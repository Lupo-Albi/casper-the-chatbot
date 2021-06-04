module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Você deve estar logado para acessar!');
		return res.redirect('/');
	}
	next();
};
