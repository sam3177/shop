const fs = require('fs');

class UsersRepo {
	constructor (filename) {
		if (!filename)
			throw new Error(
				'creating a repo requires a filename'
			);
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}
	async getAll () {
		//open the content of this.filename
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding : 'utf8'
			})
		);
	}
	async addUser (attrs) {
		const records = await this.getAll();
		// console.log(users);
		records.push(attrs);
		this.writeAll(records);
	}
	async writeAll (records) {
		fs.promises.writeFile(
			this.filename,
			JSON.stringify(records)
		);
	}
}

const test = async () => {
	const users = new UsersRepo('users.json');
	await users.addUser({
		username : 'samuel',
		password : 'prsssssssssssssssss'
	});

	const content = await users.getAll();

	console.log(content);
};

// test();
module.exports = UsersRepo;