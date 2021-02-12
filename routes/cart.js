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
         //if not, add it
			else {
				cart.products.push({
					id    : product.id,
					count : 1
				});
			}
			await cartsRepo.edit(cart.id, cart);
      }
      //if !cart, make one and add product to it
		else {
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
router.get('/cart', async (req, res)=>{
   if(req.session.cartId){
      const cart = await cartsRepo.getOne(req.session.cartId)
      const products =  cart.products.map(async p=>{
         const prod = await productsRepo.getOne(p.id)
         return prod
      })
      console.log(products)
      return res.render('./cart',{products})
   }
})

module.exports = router;
