const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter { };

// initialize object
const myEmitter = new MyEmitter();

// add listener to the log events
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    // emit the event
    myEmitter.emit('log', 'Log Event Emitted!');
}, 2000);