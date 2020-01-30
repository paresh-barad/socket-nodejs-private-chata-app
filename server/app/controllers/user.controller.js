const userService = require('../services/user.service');
const CONSTANTS = require('../../config/constants.config');
const passwordHash = require('../helpers/passwordhash.helper');

class UserController {

	async userNameCheck(request, response) {
		const username = request.body.username;
		if (username === "") {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERNAME_NOT_FOUND
			});
		} else {
			try {
				const count = await userService.userNameCheck({
					username: username.toLowerCase()
				});
				if (count > 0) {
					response.status(200).json({
						error: true,
						message: CONSTANTS.USERNAME_AVAILABLE_FAILED
					});
				} else {
					response.status(200).json({
						error: false,
						message: CONSTANTS.USERNAME_AVAILABLE_OK
					});
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
					error: true,
					message: CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	}

	async login(request, response) {
		const data = {
			username: (request.body.username).toLowerCase(),
			password: request.body.password
		};
		if (data.username === '' || data.username === null) {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERNAME_NOT_FOUND
			});
		} else if (data.password === '' || data.password === null) {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.PASSWORD_NOT_FOUND
			});
		} else {
			try {
				const result = await userService.getUserByUsername(data.username);
				if (!result.length) {
					response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
						error: true,
						message: CONSTANTS.USER_LOGIN_FAILED
					});
				} else {
					if (passwordHash.compareHash(data.password, result[0].password)) {
						await userService.makeUserOnline(result[0]._id);
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error: false,
							userId: result[0]._id,
							message: CONSTANTS.USER_LOGIN_OK
						});
					} else {
						response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
							error: true,
							message: CONSTANTS.USER_LOGIN_FAILED
						});
					}
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error: true,
					message: CONSTANTS.USER_LOGIN_FAILED
				});
			}
		}
	}

	async register(request, response) {

		const data = {
			username: (request.body.username).toLowerCase(),
			password: request.body.password
		};

		if (data.username === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERNAME_NOT_FOUND
			});
		} else if (data.password === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.PASSWORD_NOT_FOUND
			});
		} else {
			try {
				data.online = true;
				data.socketId = '';
				data.password = passwordHash.createHash(data.password);
				const result = await userService.registerUser(data);
				if (typeof result == 'undefined') {
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error: false,
						message: CONSTANTS.USER_REGISTRATION_FAILED
					});
				} else {
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error: false,
						userId: result._id,
						message: CONSTANTS.USER_REGISTRATION_OK
					});
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error: true,
					message: CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	}

	async userSessionCheck(request, response) {
		let userId = request.body.userId;
		if (userId === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERID_NOT_FOUND
			});
		} else {
			try {
				const result = await userService.userSessionCheck({ userId: userId });
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error: false,
					username: result.username,
					message: CONSTANTS.USER_LOGIN_OK
				});
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error: true,
					message: CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	}

	async getMessages(request, response) {
		const userId = request.body.userId;
		const toUserId = request.body.toUserId;
		if (userId == '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERID_NOT_FOUND
			});
		} else {
			try {
				const messagesResponse = await userService.getMessages({
					userId: userId,
					toUserId: toUserId
				});
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error: false,
					messages: messagesResponse
				});
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error: true,
					messages: CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	}

	routeNotFound(request, response) {
		response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
			error: true,
			message: CONSTANTS.ROUTE_NOT_FOUND
		});
	}
}

module.exports = new UserController();
