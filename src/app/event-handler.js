import isArray from 'lodash.isarray';
import ClientManager from './client-manager';
import ChannelManager from './channel-manager';
import log from 'tools/log';

class EventHandler {
	constructor(events, channelProperty) {
		this.clientManager = new ClientManager();
		this.channelManager = new ChannelManager();
		this.events = events;
		this.channelProperty = channelProperty;
	}

	handleEvent(socket, eventName, payload = null) {
		const clientId = socket.id;
		log.debug(`---> handleEvent: '${eventName}' clientId: '${clientId}' payload:`, payload);

		switch (eventName) {
			case this.events.CONNECT:
				this.clientManager.registerClient(clientId, socket);
				this.clientManager.dumpClients();
				break;

			case this.events.DISCONNECT: {
				log.debug(`Client disconnected: ${payload}`);
				const client = this.clientManager.getClient(clientId);
				if (client) {
					this.channelManager.removeSubscriberFromChannels(clientId, client.getChannels());
					this.clientManager.deregisterClient(clientId);
				}
				break;
			}

			case this.events.ERROR:
				log.error(`An error occurred: ${payload}`);
				break;

			case this.events.SUBSCRIBE:
				if (this._isValidPayload(payload)) {
					this._handleSubscribeEvent(clientId, payload[this.channelProperty]);
				} else {
					log.error('Malformed SUBSCRIBE event.');
				}
				break;

			case this.events.UNSUBSCRIBE:
				if (this._isValidPayload(payload)) {
					this._handleUnsubscribeEvent(clientId, payload[this.channelProperty]);
				} else {
					log.error('Malformed UNSUBSCRIBE event.');
				}
				break;

			default:
				this._dispatchEvent(eventName, payload);
				break;
		}
	}

	_handleSubscribeEvent(clientId, channels) {
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

	_handleUnsubscribeEvent(clientId, channels) {
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

	_dispatchEvent(eventName, payload) {
		log.debug(`dispatchEvent: ${eventName} payload:`, payload);
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

	_isValidPayload(payload) {
		return (payload && payload[this.channelProperty] && isArray(payload[this.channelProperty]));
	}
}

export default EventHandler;
