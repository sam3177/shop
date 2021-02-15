const express = require('express');
const usersRepo = require('../../repos/users');
const router = express.Router();
const {
	errMiddleware
} = require('./middlewares');

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
	errMiddleware('register'),
	async (req, res) => {
		const { username, password } = req.body;

		const user = await usersRepo.addUser({
			username,
			password
		});
		//get id from user and add it to the cookie session
		req.session.userId = user.id;
		req.session.userName = user.username;

		console.log('user added');
		res.redirect('/admin/products');
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
	errMiddleware('login'),
	async (req, res) => {
		const { username, password } = req.body;

		const existing = await usersRepo.getOneBy({
			username
		});
		req.session.userId = existing.id;
		req.session.userName = existing.username;
		res.redirect('/admin/products');
	}
);
//logout GET
router.get('/logout', (req, res) => {
	req.session = null;
	res.locals.user = null;
	res.redirect('/');
});

module.exports = router;
