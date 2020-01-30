class UserService {

	constructor() {
		this.Mongodb = require("../../config/db.config");
		this.User = require('../models/user.model');
		this.Message = require('../models/message.model');
	}

	userNameCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.find(data);
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	getUserByUsername(username) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.find({ username: username });
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	makeUserOnline(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.findByIdAndUpdate(userId, { 'online': true });
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	registerUser(data) {
		return new Promise(async (resolve, reject) => {
			try {
				var user = new this.User(data);
				let result = await user.save(data);
				resolve(result);
			} catch (error) {
				reject(error)
			}
		});
	}

	userSessionCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.findOne({
					_id: data.userId,
					online: true
				});
				resolve(result);
			} catch (error) {
				reject(error)
			}
		});
	}

	getUserInfo({ userId, socketId = false }) {
		let queryProjection = null;
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.find({
					_id: userId
				});
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	addSocketId({ userId, socketId }) {
		return new Promise(async (resolve, reject) => {
			const data = {
				socketId: socketId,
				online: true
			};

			try {
				let result = await this.User.findByIdAndUpdate(userId, data);
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	getChatList(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.User.find({
					'socketId': { $ne: userId }
				});
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	insertMessages(messagePacket) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.Message.create(messagePacket);
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	getMessages({ userId, toUserId }) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = {
					'$or': [
						{
							'$and': [
								{
									'toUserId': userId
								}, {
									'fromUserId': toUserId
								}
							]
						}, {
							'$and': [
								{
									'toUserId': toUserId
								}, {
									'fromUserId': userId
								}
							]
						},
					]
				};
				let result = await this.Message.find(data)
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	logout(userID, isSocketId) {
		return new Promise(async (resolve, reject) => {
			try {
				let condition = {};
				if (isSocketId) {
					condition.socketId = userID;
				} else {
					condition._id = userID;
				}

				let result = await this.User.findOneAndUpdate(condition, {
					online: false
				}, { useFindAndModify: false });

				resolve(result);
			} catch (error) {
				reject()
			}
		});
	}
}

module.exports = new UserService();