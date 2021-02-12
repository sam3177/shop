const express = require('express');
const bodyParser = require('body-parser');
// const usersRepo = require('./repos/users');
const cookieSession = require('cookie-session');
const app = express();

const authRoutes = require('./routes/admin/auth');
const adminRoutes = require('./routes/admin/products');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
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
app.use(productsRoutes);
app.use(cartRoutes);

//RESTful ROUTES


app.listen(3000, () =>
	console.log('server Started')
);
