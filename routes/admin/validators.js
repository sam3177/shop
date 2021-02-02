const { check } = require('express-validator');
const usersRepo = require('../../repos/users');
const productsRepo = require('../../repos/products');

module.exports = {
	usernameValidator        : check('username')
		.trim()
		.custom(async (username) => {
			const existing = await usersRepo.getOneBy({
				username
			});
			if (existing) {
				throw new Error(
					`"${username}" is already in use!`
				);
			}
		}),
	passwordValidator        : check('password')
		.trim()
		.custom((pass) => {
			if (pass.length < 5) {
				throw new Error('Password too short!');
			}
			else return true;
		}),
	passwordConfirmValidator : check(
		'passwordConfirm'
	)
		.trim()
		// .isLength({ min: 5 })
		.custom((pass, { req }) => {
			if (pass !== req.body.password) {
				throw new Error(
					'The passwords must match!'
				);
			}
			else return true;
		}),
	usernameLoginValidator   : check('username')
		.trim()
		.custom(async (username) => {
			const existing = await usersRepo.getOneBy({
				username
			});
			if (!existing) {
				throw new Error(
					`"${username}" is not a valid user!`
				);
			}
			else return true;
		}),
	passwordLoginValidator   : check('password')
		.trim()
		.custom(async (pass, { req }) => {
			const existing = await usersRepo.getOneBy({
				username : req.body.username
			});
			if (existing) {
				const log = await usersRepo.comparePass(
					existing.password,
					pass
				);
				if (!log) {
					throw new Error(`Wrong password!`);
				}
				else return true;
			}
		}),
	nameValidator            : check('name')
		.trim()
		.custom(async (product) => {
			const existing = await productsRepo.getOneBy(
				{
					product
				}
			);
			if (existing) {
				throw new Error(
					`"${product}" already exists!`
				);
			}
		}),
	imageValidator           : check(
		'image'
	).trim(),
	priceValidator           : check('price')
		.trim()
		.isNumeric(),
	descriptionValidator     : check(
		'description'
	).trim()
};
