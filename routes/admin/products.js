const express = require('express');
const productsRepo = require('../../repos/products');
const router = express.Router();
const {
	errMiddleware,
	loggedInMiddleware
} = require('./middlewares');

const {
	nameValidator,
	imageValidator,
	priceValidator,
	descriptionValidator
} = require('./validators');
const multer = require('multer');
const upload = multer({
	storage : multer.memoryStorage()
});

//show page GET

router.get(
	'/admin/products',
	loggedInMiddleware,
	async (req, res) => {
		console.log('plmplm', res.locals.user);
		const products = await productsRepo.getAll();
		res.render('./admin/products/adminShow', {
			products
		});
	}
);

// show new product form get

router.get(
	'/admin/products/new',
	loggedInMiddleware,
	(req, res) => {
		res.render('./admin/products/new');
	}
);
router.post(
	'/admin/products/new',
	loggedInMiddleware,
	upload.single('image'),
	[
		nameValidator,
		imageValidator,
		priceValidator,
		descriptionValidator
	],
	errMiddleware('newProduct'),
	async (req, res) => {
		await productsRepo.add({
			...req.body,
			image :
				req.file ? req.file.buffer.toString(
					'base64'
				) :
				'nnone'
		});
		console.log('product added');
		res.redirect('/admin/products');
	}
);

module.exports = router;
