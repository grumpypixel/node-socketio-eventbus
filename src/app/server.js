/* eslint-disable no-console */
import socketIO from 'socket.io';
import socketEvents from 'socket.io-events';
import ip from 'ip';
import defaults from 'constants/defaults';
import EventHandler from './event-handler';

const port = process.env.PORT || defaults.port;
const io = socketIO.listen(port);
console.log(`EventBus listening on ${ip.address()}:${port}`);

const events = {
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	ERROR: 'error',
	SUBSCRIBE: defaults.events.hey,
	UNSUBSCRIBE: defaults.events.bye,
};
const channelProperty = 'subscriptions';
const eventHandler = new EventHandler(events, channelProperty);

io.on('connection', (socket) => {
	eventHandler.handleEvent(socket, events.CONNECT);
	socket.on(events.DISCONNECT, (reason) => {
		eventHandler.handleEvent(socket, events.DISCONNECT, reason);
	});
	socket.on(events.ERROR, (error) => {
		eventHandler.handleEvent(socket, events.ERROR, error);
	});
});

const router = socketEvents();
router.on((socket, args, next) => {
	const eventName = args.shift();
	const payload = args.shift();
	eventHandler.handleEvent(socket, eventName, payload);
	next();
});

io.use(router);
