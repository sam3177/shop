const express = require('express');
const bodyParser = require('body-parser');
const UsersRepo = require('./repos/users');
const app = express();
const allUsers = new UsersRepo('users.json');
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

app.post('/register', (req, res) => {
	const {
		name,
		password,
		passwordConfirm
	} = req.body.user;
	if (password === passwordConfirm) {
		allUsers.addUser({ name, password });
		res.render('home');
	}
	else { 
		res.render('register');
	}
});

app.listen(3000, () =>
	console.log('server Started')
);
