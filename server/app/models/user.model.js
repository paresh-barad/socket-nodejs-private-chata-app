const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	online: {
		type: Boolean,
		default: true
	},
	socketId: {
		type: String,
		default: ""
	}
});
module.exports = mongoose.model('User', userSchema);