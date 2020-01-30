const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
	toUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	fromUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	message: {
		type: String,
		default: ""
	}
});
module.exports = mongoose.model('Message', messageSchema);