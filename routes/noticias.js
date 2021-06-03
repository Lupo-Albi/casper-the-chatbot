const express = require('express');
const router = express.Router();
const Noticia = require('../models/noticia');

router.get('/', async (req, res) => {
	const noticias = await Noticia.find();
	res.render('noticias/index', { title: 'Notícias', noticias });
	// console.log('Get index view');
});

router.get('/new', (req, res) => {
	res.render('noticias/new', { title: 'Criar nova notícia' });
	// console.log('Get new view')
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findById(id);
	res.render('noticias/show', { title: noticia.title, noticia });
	// console.log('Get show view');
});

router.get('/:id/edit', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findById(id);
	res.render('noticias/edit', { title: 'Editar', noticia });
	// console.log('Get edit view');
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia }, { useFindAndModify: false });
	res.redirect(`/noticias/${noticia._id}`);
});

router.post('/', async (req, res) => {
	const noticia = new Noticia(req.body.noticia);
	await noticia.save();
	res.redirect('/noticias');
	// console.log("Post new noticia")
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await Noticia.findByIdAndDelete(id);
	res.redirect('/noticias');
});

module.exports = router;
