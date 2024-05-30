const event = require('events');


class SocketPortalEvent extends event.EventEmitter {
    events = {
        newOrderCreated: 'newOrderCreated',
        orderStatusChanged: 'orderStatusChanged'
    }
}

class SocketPortal {
    static socketPortalEvent = new SocketPortalEvent();
}

module.exports = SocketPortal;