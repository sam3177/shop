const express = require('express');
const productsRepo = require('../repos/products');
const cartsRepo = require('../repos/carts');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// add product to cart
router.post(
	'/cart/products/:id',
	async (req, res) => {
		const product = await productsRepo.getOne(
			req.params.id
		);
		//if cart already exists
		if (req.session.cartId) {
			const cart = await cartsRepo.getOne(
				req.session.cartId
			);
			const existing = cart.products.find(
				(p) => p.id === product.id
			);
			//if existing product, increment it's 'count' val
			if (existing) {
				existing.count++;
			}
			else {
				//if not, add it
				cart.products.push({
					id    : product.id,
					count : 1
				});
			}
			await cartsRepo.edit(cart.id, cart);
		}
		else {
			//if !cart, make one and add product to it
			const newCart = {
				products : []
			};
			newCart.products.push({
				id    : product.id,
				count : 1
			});
			const cart = await cartsRepo.add(newCart);
			req.session.cartId = cart.id;
		}
		res.redirect('/');
	}
);

//show cart GET
router.get('/cart', async (req, res) => {
	if (req.session.cartId) {
		const cart = await cartsRepo.getOne(
			req.session.cartId
		);
		const products = await Promise.all(
			cart.products.map(async (p) => {
				const prod = await productsRepo.getOne(
					p.id
				);
				return { ...prod, count: p.count };
			})
		);
		const total = products.reduce(
			(prev, prod) =>
				prev + prod.price * prod.count, 0
		);
		return res.render('./cart', {
			products, total
		});
	}
	else {
		res.redirect('/');
	}
});

//decrement count POST
router.post(
	'/cart/products/:id/minus',
	async (req, res) => {
		if (req.session.cartId) {
			const cart = await cartsRepo.getOne(
				req.session.cartId
			);
			const newCartItems = cart.products
				.map((p) => {
					if (p.id === req.params.id) {
						return { ...p, count: p.count - 1 };
					}
					else return p;
				})
				.filter((p) => p.count >= 1);
			await cartsRepo.edit(req.session.cartId, {
				products : newCartItems
			});
			return res.redirect('/cart');
		}
		else {
			res.redirect('/');
		}
	}
);

//increment count POST
router.post(
	'/cart/products/:id/plus',
	async (req, res) => {
		if (req.session.cartId) {
			const cart = await cartsRepo.getOne(
				req.session.cartId
			);
			const newCartItems = cart.products.map(
				(p) => {
					if (p.id === req.params.id) {
						return { ...p, count: p.count + 1 };
					}
					else return p;
				}
			);
			await cartsRepo.edit(req.session.cartId, {
				products : newCartItems
			});
			return res.redirect('/cart');
		}
		else {
			res.redirect('/');
		}
	}
);

//remove product from cart POST
router.post(
	'/cart/products/:id/remove',
	async (req, res) => {
		if (req.session.cartId) {
			const cart = await cartsRepo.getOne(
				req.session.cartId
			);
			const newCartItems = cart.products.filter(
				(p) => p.id !== req.params.id
			);
			await cartsRepo.edit(req.session.cartId, {
				products : newCartItems
			});
			return res.redirect('/cart');
		}
		else {
			res.redirect('/');
		}
	}
);

//checkout GET
router.get('/cart/checkout', (req, res) =>{
	res.render('./checkout')
})

module.exports = router;
