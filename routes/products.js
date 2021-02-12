const express = require('express');
const productsRepo = require('../repos/products');
const router = express.Router();

// show products to user GET
router.get('/', async (req, res) =>{
   const products = await productsRepo.getAll()
   res.render('./index',{products})
})


module.exports = router;
