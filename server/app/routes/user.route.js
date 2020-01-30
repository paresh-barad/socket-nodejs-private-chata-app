const UserController = require('../controllers/user.controller');

class Routes {

	constructor(app) {
		this.app = app;
	}

	appRoutes() {
		this.app.post('/usernameAvailable', UserController.userNameCheck);
		this.app.post('/register', UserController.register);
		this.app.post('/login', UserController.login);
		this.app.post('/userSessionCheck', UserController.userSessionCheck);
		this.app.post('/getMessages', UserController.getMessages);
		this.app.get('*', UserController.routeNotFound);
	}

	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;