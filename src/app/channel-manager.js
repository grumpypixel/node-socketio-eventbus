/* eslint-disable no-console */
import Channel from './channel';

class ChannelManager {
	constructor() {
		this.channels = new Map();
	}

	createChannel(name) {
		console.log('createChannel', name);
		let channel = this.channels.get(name);
		if (!channel) {
			channel = new Channel();
			this.channels.set(name, channel);
		}
		return channel;
	}

	destroyChannel(name) {
		this.channels.delete(name);
	}

	getChannel(name) {
		return this.channels.get(name);
	}

	addSubscriber(subscriber, channelName) {
		console.log('addChannelSubscriber', channelName, subscriber);
		const channel = this.createChannel(channelName);
		if (channel) {
			channel.addSubscriber(subscriber);
		}
		this.dumpChannels();
	}

	removeSubscriber(subscriber, channelName) {
		console.log('removeChannelSubscriber', channelName, subscriber);
		const channel = this.getChannel(channelName);
		if (channel) {
			channel.removeSubscriber(subscriber);
			if (channel.getSubscriberCount() === 0) {
				this.destroyChannel(channelName);
			}
		}
		this.dumpChannels();
	}

	removeSubscriberFromChannels(subscriber, channels) {
		console.log('removeSubscriberFromChannels', subscriber, channels);
		for (let i = 0; i < channels.length; ++i) {
			this.removeSubscriber(subscriber, channels[i]);
		}
	}

	dumpChannels() {
		console.log('---> channels size:', this.channels.size);
		this.channels.forEach((value, key, map) => {
			console.log({
				name: key,
				subscribers: value.subscribers,
			});
		});
	}
}

export default ChannelManager;
