/* eslint-disable no-console */
import socketIO from 'socket.io';
import socketEvents from 'socket.io-events';
import ip from 'ip';
import Defaults from 'constants/defaults';
import Events from 'constants/events';
import EventHandler from './event-handler';

const port = process.env.PORT || Defaults.PORT;
const eventHandler = new EventHandler();
const io = socketIO.listen(port);

console.log('EventBus listening on', ip.address() + ':' + port);

const router = socketEvents();
router.on((socket, args, next) => {
	const eventName = args.shift();
	const payload = args.shift();
	eventHandler.handleEvent(eventName, socket, payload);
	next();
});

io.on('connection', (socket) => {
	eventHandler.handleEvent(Events.CONNECT_EVENT, socket);
	socket.on(Events.DISCONNECT_EVENT, () => {
		eventHandler.handleEvent(Events.DISCONNECT_EVENT, socket);
	});
	socket.on(Events.ERROR_EVENT, () => {
		eventHandler.handleEvent(Events.ERROR_EVENT, socket);
	});
});

io.use(router);
