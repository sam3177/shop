const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repos/users');
const app = express();

//app config
app.set('view engine', 'ejs');
app.use(
	bodyParser.urlencoded({ extended: true })
);

//RESTful ROUTES
//home
app.get('/', (req, res) => {
	console.log();
	res.render('home', { user: '' });
});
//index GET
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const {
		username,
		password,
		passwordConfirm
	} = req.body;
	const existing = await usersRepo.getOneBy({
		username
	});
	if (existing) {
		res.render('register');
		throw new Error(
			'this username is already in use!'
		);
	}
	if (
		password !== '' &&
		password === passwordConfirm
	) {
		usersRepo.addUser({ username, password });
		console.log('user added');
		res.render('home');
	}
	else {
		res.render('register');
		throw new Error('password typo');
	}
});

app.listen(3000, () =>
	console.log('server Started')
);
