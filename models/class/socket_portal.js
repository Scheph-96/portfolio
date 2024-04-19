const event = require('events');


class SocketPortalEvent extends event.EventEmitter {
    events = {
        orderUpdate: 'orderUpdate'
    }
}

class SocketPortal {

    static socketPortalEvent = new SocketPortalEvent();
}

module.exports = SocketPortal;