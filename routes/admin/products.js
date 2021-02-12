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
		res.render('./admin/products/new', {
			product : ''
		});
	}
);
//new product post
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
				''
		});
		console.log('product added');
		res.redirect('/admin/products');
	}
);
//edit product get
router.get(
	'/admin/products/:id/edit',
	async (req, res) => {
		const product = await productsRepo.getOne(
			req.params.id
		);
		if (!product)
			return res.redirect('/admin/products');
		res.render('./admin/products/edit', {
			product
		});
	}
);
//edit product post
router.post(
	'/admin/products/:id/edit',
	upload.single('image'),
	[
		nameValidator,
		imageValidator,
		priceValidator,
		descriptionValidator
	],
	errMiddleware('editProduct'),
	async (req, res) => {
		const edited = req.body;

			req.file ? (edited.image = req.file.buffer.toString(
				'base64'
			)) :
			delete edited.image;
		// if(req.file) edited.image = req.file
		try {
			await productsRepo.edit(
				req.params.id,
				edited
			);
		} catch (err) {
			console.log(err);
		}

		res.redirect('/admin/products');
	}
);
//delete product POST
router.post('/admin/products/:id/delete',async (req, res)=>{
	await productsRepo.remove(req.params.id)
	res.redirect('/admin/products');

})
module.exports = router;
