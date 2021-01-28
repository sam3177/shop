const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
		records.push({ ...attrs, id: uuidv4() });
		await this.writeAll(records);
	}
	async writeAll (records) {
		fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 3)
		);
	}
	async getOne (id) {
		const records = await this.getAll();
		return records.find(
			(record) => record.id === id
		);
	}
	async removeUser (id) {
		const records = await this.getAll();
		const updatedList = records.filter(
			(record) => record.id !== id
		);
		await this.writeAll(updatedList);
	}
	async editUser (id, attrs) {
		const records = await this.getAll();
		if (
			!records.find((record) => record.id === id)
		) {
			throw new Error(
				`The user with id ${id} does not exist!`
			);
		}
		const updatedList = records.map((record) => {
			if (record.id !== id) return record;
			else
				//Object.assign(record,attrs)
				return { ...record, ...attrs };
		});
		await this.writeAll(updatedList);
	}
	async getOneBy (filters) {
		const records = await this.getAll();
		const user = records.find((record) => {
			let found = true;
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) return record;
		});
		return user;
	}
}

const test = async () => {
	const users = new UsersRepo('users.json');

	await users.getOneBy({ avatar: 'http' });

	// console.log(content);
};

// test();
module.exports = new UsersRepo('users.json');
