const mongoose = require('mongoose');
const assert = require('assert');

class Db {
	constructor() {
		const mongoURL = process.env.DB_URL;
		mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function () {
			console.log('mongodb is connected!');
		});
	}
}
module.exports = new Db();