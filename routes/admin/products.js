const express = require('express');
const productsRepo = require('../../repos/products');
const router = express.Router();
const makeErr = require('./errHelper');
const {
	validationResult
} = require('express-validator');
const {
	nameValidator,
	imageValidator,
	priceValidator,
	descriptionValidator
} = require('./validators');

//show page GET

router.get(
	'/admin/products',
	async (req, res) => {
		const products = await productsRepo.getAll();
		res.render('./admin/products/adminShow', {
			products
		});
	}
);

// show new product form get

router.get('/admin/products/new', (req, res) => {
	res.render('./admin/products/new');
});
router.post(
	'/admin/products/new',
	[
		nameValidator,
		imageValidator,
		priceValidator,
		descriptionValidator
	],
	async (req, res) => {
		// const { name, password } = req.body;
		const errorsArr = validationResult(req);
		console.log(errorsArr);
		if (!errorsArr.isEmpty()) {
			const errors = makeErr(errorsArr);
			return res.render('./admin/products/new', { errors });
		}

		const product = await productsRepo.add(
			req.body
		);

		console.log('product added');
		res.redirect('/admin/products');
	}
);

module.exports = router;
