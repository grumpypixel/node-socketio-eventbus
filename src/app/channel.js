class Channel {
	constructor() {
		this.subscribers = [];
	}

	addSubscriber(subscriber) {
		if (this.subscribers.indexOf(subscriber) === -1) {
			this.subscribers.push(subscriber);
		}
	}

	removeSubscriber(subscriber) {
		if (this.subscribers.length > 0) {
			const index = this.subscribers.indexOf(subscriber);
			if (index !== -1) {
				this.subscribers.splice(index, 1);
			}
		}
	}

	getSubscribers() {
		return this.subscribers;
	}

	getSubscriberCount() {
		return this.subscribers.length;
	}
}

export default Channel;
