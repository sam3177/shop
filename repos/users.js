const { v4: uuidv4 } = require('uuid');
const Repository  = require('./repository');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo extends Repository{
	async addUser (attrs) {
		const records = await this.getAll();
		const salt = crypto
			.randomBytes(8)
			.toString('hex');
		const hash = await scrypt(
			attrs.password,
			salt,
			64
		);
		const newUser = {
			username : attrs.username,
			password : `${hash.toString(
				'hex'
			)}-${salt}`,
			id       : uuidv4()
		};
		records.push(newUser);
		await this.writeAll(records);
		return newUser;
	}

	async comparePass (saved, provided) {
		const [ hash, salt ] = saved.split('-');
		const testHash = await scrypt(
			provided,
			salt,
			64
		);
		return hash === testHash.toString('hex');
	}
}

module.exports = new UsersRepo('users.json');
