const {
	validationResult
} = require('express-validator');

const productsRepo = require('../../repos/products');

module.exports = {
	errMiddleware      : (destination) => {
		return async (req, res, next) => {
			const errorsArr = validationResult(req);
			if (!errorsArr.isEmpty()) {
				const errorsObj = errorsArr.mapped();
				const errors = {};
				for (let key in errorsObj) {
					errors[key] = errorsObj[key].msg;
				}
				switch (destination) {
					case 'register':
						return res.render(
							'./admin/auth/register',
							{ errors }
						);
					case 'login':
						return res.render(
							'./admin/auth/login',
							{
								errors
							}
						);
					case 'newProduct':
						return res.render(
							'./admin/products/new',
							{
								errors,
								product : {
									...req.body,
									image : req.file
								}
							}
						);
					case 'editProduct':
						const product = await productsRepo.getOne(
							req.params.id
						);
						return res.render(
							'./admin/products/edit',
							{
								product,
								errors
							}
						);
					default:
						console.log(
							'We need a valid destination in case of error!'
						);
				}
			}
			next();
		};
	},
	loggedInMiddleware : (req, res, next) => {
		if (!req.session.userId) {
			return res.redirect('/login');
		}
		next();
	}
};
