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
app.use(cookieSession({ keys: [ 'qwerty' ] }));
app.use((req, res, next) => {
	try{
		res.locals.user =req.session? req.session.userId : false
	} catch(e){
		res.locals.user =false
		
	}
	res.locals.errors = {
		username: undefined,
		password: undefined,
		passwordConfirm: undefined
	}
	next();
});
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
