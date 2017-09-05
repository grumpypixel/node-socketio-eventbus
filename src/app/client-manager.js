/* eslint-disable no-console */
import Client from './client';

class ClientManager {
	constructor() {
		this.clients = new Map();
	}

	registerClient(clientId, socket, timestamp) {
		console.log('registerClient', clientId);
		const client = new Client(socket, timestamp);
		this.clients.set(clientId, client);
	}

	deregisterClient(clientId) {
		console.log('deregisterClient', clientId);
		this.clients.delete(clientId);
	}

	isRegisteredClient(clientId) {
		return this.clients.has(clientId);
	}

	getClient(clientId) {
		return this.clients.get(clientId);
	}

	dumpClients() {
		console.log('---> clients size:', this.clients.size);
		this.clients.forEach((value, key, map) => {
			console.log({
				id: key,
				channels: value.channels,
			});
		});
	}
}

export default ClientManager;
