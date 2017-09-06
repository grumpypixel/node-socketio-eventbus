/* eslint-disable no-console */
import Channel from './channel';
import log from 'tools/log';

class ChannelManager {
	constructor() {
		this.channels = new Map();
	}

	createChannel(channelName) {
		log.debug(`createChannel ${channelName}`);
		let channel = this.channels.get(channelName);
		if (!channel) {
			channel = new Channel();
			this.channels.set(channelName, channel);
		}
		return channel;
	}

	destroyChannel(channelName) {
		log.debug(`destroyChannel ${channelName}`);
		this.channels.delete(channelName);
	}

	getChannel(channelName) {
		return this.channels.get(channelName);
	}

	addSubscriber(subscriber, channelName) {
		log.debug(`addSubscriber ${subscriber} ${channelName}`);
		const channel = this.createChannel(channelName);
		if (channel) {
			channel.addSubscriber(subscriber);
		}
	}

	removeSubscriber(subscriber, channelName) {
		log.debug(`remomveSubscriber ${subscriber} ${channelName}`);
		const channel = this.getChannel(channelName);
		if (channel) {
			channel.removeSubscriber(subscriber);
			if (channel.getSubscriberCount() === 0) {
				this.destroyChannel(channelName);
			}
		}
	}

	removeSubscriberFromChannels(subscriber, channels) {
		log.debug(`removeSubscriberFromChannels ${subscriber}`, channels);
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
