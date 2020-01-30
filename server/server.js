require('dotenv').config()
const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const socketEvents = require('./app/handlers/socket.handler');
const routes = require('./app/routes/user.route');
const appConfig = require('./config/app.config');

class Server {

	constructor() {
		this.app = express();
		this.http = http.Server(this.app);
		this.socket = socketio(this.http);
	}

	appConfig() {
		new appConfig(this.app).includeConfig();
	}

	includeRoutes() {
		new routes(this.app).routesConfig();
		new socketEvents(this.socket).socketConfig();
	}

	appExecute() {
		this.appConfig();
		this.includeRoutes();

		const port = process.env.PORT || 4000;
		const host = process.env.HOST || `localhost`;

		this.http.listen(port, host, () => {
			console.log(`Listening on http://${host}:${port}`);
		});
	}
}

const app = new Server();
app.appExecute();