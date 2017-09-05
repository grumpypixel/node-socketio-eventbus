/* eslint-disable no-console */
import Events from 'constants/events';
import ClientManager from './client-manager';
import ChannelManager from './channel-manager';

class EventHandler {
	constructor(clientManager, channelManager) {
		this.clientManager = new ClientManager();
		this.channelManager = new ChannelManager();
	}

	handleEvent(eventName, socket, payload = null) {
		const clientId = socket.id;
		console.log('--->', eventName, clientId, payload);

		switch (eventName) {
			case Events.CONNECT_EVENT:
				console.log('CONNECT', clientId);
				this.clientManager.registerClient(clientId, socket);
				this.clientManager.dumpClients();
				break;

			case Events.DISCONNECT_EVENT: {
				console.log('DISCONNECT', clientId);
				const client = this.clientManager.getClient(clientId);
				if (client) {
					this.channelManager.removeSubscriberFromChannels(clientId, client.getChannels());
					this.clientManager.deregisterClient(clientId);
				}
				this.channelManager.dumpChannels();
				this.clientManager.dumpClients();
				break;
			}

			case Events.ERROR_EVENT:
				break;

			case Events.SUBSCRIBE_EVENT:
				this.handleSubscribeEvent(clientId, payload.channels);
				this.channelManager.dumpChannels();
				break;

			case Events.UNSUBSCRIBE_EVENT:
				this.handleUnsubscribeEvent(clientId, payload.channels);
				this.channelManager.dumpChannels();
				break;

			default:
				this.dispatchEvent(eventName, payload);
				break;
		}
	}

	handleSubscribeEvent(clientId, channels) {
		console.log('handleSubscribeEvent', clientId, channels);
		if (channels) {
			const client = this.clientManager.getClient(clientId);
			if (client) {
				channels.forEach((channelName, index, array) => {
					client.addChannel(channelName);
					this.channelManager.addSubscriber(clientId, channelName);
				});
			}
		}
	}

	handleUnsubscribeEvent(clientId, channels) {
		console.log('handleUnsubscribeEvent', clientId, channels);
		if (channels) {
			const client = this.clientManager.getClient(clientId);
			if (client) {
				channels.forEach((channelName, index, array) => {
					client.removeChannel(channelName);
					this.channelManager.removeSubscriber(clientId, channelName);
				});
			}
		}
	}

	dispatchEvent(eventName, payload) {
		const channel = this.channelManager.getChannel(eventName);
		if (channel) {
			const subscribers = channel.getSubscribers();
			subscribers.forEach((value, index, array) => {
				const client = this.clientManager.getClient(value);
				if (client) {
					client.socket.emit(eventName, payload);
				}
			});
		}
	}
}

export default EventHandler;
