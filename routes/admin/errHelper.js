const makeErr = (arr) => {
	const errorsObj = arr.mapped();
	const errors = {};
	for (let key in errorsObj) {
		errors[key] = errorsObj[key].msg;
   }
   return errors
};
module.exports = makeErr
