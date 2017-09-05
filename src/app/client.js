class Client {
	constructor(socket) {
		this.socket = socket;
		this.channels = [];
	}

	getSocket() {
		return this.socket;
	}

	getChannels() {
		return this.channels;
	}

	addChannel(channelName) {
		if (this.channels.indexOf(channelName) === -1) {
			this.channels.push(channelName);
		}
	}

	removeChannel(channelName) {
		if (this.channels.length > 0) {
			const index = this.channels.indexOf(channelName);
			if (index !== -1) {
				this.channels.splice(index, 1);
			}
		}
	}
}

export default Client;
