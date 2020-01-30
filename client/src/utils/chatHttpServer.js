import * as axios from 'axios';

class ChatHttpServer {

	constructor() {
		this.apiBaseUrl = 'http://localhost:4000';
	}

	getUserId() {
		return new Promise((resolve, reject) => {
			try {
				resolve(localStorage.getItem('userid'));
			} catch (error) {
				reject(error);
			}
		});
	}

	removeLS() {
		return new Promise((resolve, reject) => {
			try {
				localStorage.removeItem('userid');
				localStorage.removeItem('username');
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	setLS(key, value) {
		return new Promise((resolve, reject) => {
			try {
				localStorage.setItem(key, value);
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	login(userCredential) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`${this.apiBaseUrl}/login`, userCredential);
				resolve(response.data);
			} catch (error) {
				reject(error);
			}
		});
	}

	checkUsernameAvailability(username) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`${this.apiBaseUrl}/usernameAvailable`, {
					username: username
				});
				resolve(response.data);
			} catch (error) {
				reject(error);
			}
		});
	}

	register(userCredential) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`${this.apiBaseUrl}/register`, userCredential);
				resolve(response);
			} catch (error) {
				reject(error);
			}
		});
	}

	userSessionCheck(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`${this.apiBaseUrl}/userSessionCheck`, {
					userId: userId
				});
				resolve(response.data);
			} catch (error) {
				reject(error);
			}
		});
	}

	getMessages(userId, toUserId) {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`${this.apiBaseUrl}/getMessages`, {
					userId: userId,
					toUserId: toUserId
				});
				resolve(response.data);
			} catch (error) {
				reject(error);
			}
		});
	}

}

export default new ChatHttpServer();