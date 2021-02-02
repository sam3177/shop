const express = require('express');
const bodyParser = require('body-parser');
// const usersRepo = require('./repos/users');
const cookieSession = require('cookie-session');
const app = express();

const authRoutes = require('./routes/admin/auth');
const adminRoutes = require('./routes/admin/products');
//app config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({ extended: true })
);
app.use((req, res, next) => {
	res.locals.user = req.session;
	console
	res.locals.errors = {
		username: undefined,
		password: undefined,
		passwordConfirm: undefined
	}
	console.log(req.session)
	next();
});
app.use(cookieSession({ keys: [ 'qwerty' ] }));
app.use(authRoutes);
app.use(adminRoutes);

//RESTful ROUTES
//home get
app.get('/', (req, res) => {
	console.log();
	res.render('home');
});

app.listen(3000, () =>
	console.log('server Started')
);
