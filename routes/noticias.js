const express = require('express');
const router = express.Router();
const Noticia = require('../models/noticia');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/middleware');

router.get(
	'/',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const noticias = await Noticia.find();
		res.render('noticias/index', { title: 'Notícias', noticias });
		// console.log('Get index view');
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('noticias/new', { title: 'Criar nova notícia' });
	// console.log('Get new view')
});

router.get(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const noticia = await Noticia.findById(id);
		res.render('noticias/show', { title: noticia.title, noticia });
		// console.log('Get show view');
	})
);

router.get(
	'/:id/edit',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const noticia = await Noticia.findById(id);
		res.render('noticias/edit', { title: 'Editar', noticia });
		// console.log('Get edit view');
	})
);

router.put(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia }, { useFindAndModify: false });
		res.redirect(`/noticias/${noticia._id}`);
	})
);

router.post(
	'/',
	isLoggedIn,
	catchAsync(async (req, res) => {
		if (!req.body.noticia) throw new ExpressError('Invalid campground data', 400);
		const noticia = new Noticia(req.body.noticia);
		await noticia.save();
		req.flash('success', 'Notícia criada com sucesso');
		res.redirect('/noticias');
		// console.log("Post new noticia")
	})
);

router.delete(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Noticia.findByIdAndDelete(id);
		res.redirect('/noticias');
	})
);

module.exports = router;
