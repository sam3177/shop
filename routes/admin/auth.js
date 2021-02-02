const express = require('express');
const usersRepo = require('../../repos/users');
const router = express.Router();
const makeErr = require('./errHelper');
const {
	validationResult
} = require('express-validator');
const {
	usernameValidator,
	passwordValidator,
	passwordConfirmValidator,
	usernameLoginValidator,
	passwordLoginValidator
} = require('./validators');
//reister GET
router.get('/register', (req, res) => {
	res.render('./admin/auth/register');
});
//register post
router.post(
	'/register',
	[
		usernameValidator,
		passwordValidator,
		passwordConfirmValidator
	],
	async (req, res) => {
		const { username, password } = req.body;
		const errorsArr = validationResult(req);
		console.log(errorsArr);
		if (!errorsArr.isEmpty()) {
			const errors = makeErr(errorsArr);
			return res.render('./admin/auth/register', { errors });
		}

		const user = await usersRepo.addUser({
			username,
			password
		});
		//get id from user and add it to the cookie session
		req.session.userId = user.id;

		console.log('user added');
		res.render('home', {
			id : req.session.userId
		});
	}
);
// login GET
router.get('/login', (req, res) => {
	res.render('./admin/auth/login');
});
//login POST
router.post(
	'/login',
	[
		usernameLoginValidator,
		passwordLoginValidator
	],
	async (req, res) => {
		const { username, password } = req.body;
		const errorsArr = validationResult(req);

		if (!errorsArr.isEmpty()) {
         console.log(errorsArr)
			const errors = makeErr(errorsArr);
			return res.render('./admin/authlogin', {errors});
		}
		const existing = await usersRepo.getOneBy({
			username
		});
		req.session.userId = existing.id;
		res.redirect('/admin/products');
	}
);
//logout GET
router.get('/logout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

module.exports = router;
