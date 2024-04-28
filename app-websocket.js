const WebSocket = require('ws');
const http = require("http");
const WebSocketMaxUserError = require('./errors/websocket_max_user');
const util = require('util');
const validator = require('validator');

const { ActivityLogger, ErrorLogger } = require('./tools/util.tool');
const AdminCrud = require('./model_crud/admin_crud');
const { socketPortalEvent } = require('./models/class/socket_portal');
// const SocketPortal = require('./models/class/socket_portal');


class AppWebsocket {
    #socketServer;

    #admins = new Set();

    /**
     * In the ws library for Node.js, when a WebSocket client connects
     * to the server and there is no 'connection' event listener 
     * explicitly defined, the client connection is still accepted 
     * by the server, but it's not directly added to the wss.clients set.
     * 
     * The wss.clients set contains all connected WebSocket clients 
     * that have been accepted by the server and for which the 'connection'
     * event listener has been set up. If there's no 'connection' event
     * listener defined, the server doesn't add the client to this set, 
     * and you won't be able to directly interact with it through wss.clients.
    */

    constructor() {
        this.#socketServer = new WebSocket.Server({ port: 2971 });
        this.#socketServer.on('close', () => {
            ActivityLogger.info("SOCKET SERVER CLOSED!");
        });
    }

    connection() {
        this.#socketServer.on('connection', this.webSocketController.bind(this));
        console.log("Websocket connection listening");
    }

    connectionOnce() {
        this.#socketServer.once('connection', this.webSocketController);
    }

    removeAllListener(eventName) {
        this.#socketServer.removeAllListeners(eventName);
    }

    close() {
        this.#socketServer.close();
    }

    handleClose() {
        console.log('Client disconnected');

        // Remove the current event listener
        // this.#socketServer.removeListener('connection', this.webSocketController);
    }
    
    socketPortalEventHandler(ws, stream) {
        // console.log("SOCKET CLIENTS: ", this.#socketServer.clients);
        console.log("SOCKET GOT ORDER CHANGE: ", stream);
        ws.send(JSON.stringify({ message: "NEW ORDER UPDATE", packet: stream }));
    };

    /**
    * 
    * @param {WebSocket} ws 
    * @param {http.IncomingMessage} req 
    */
    webSocketController(ws, req) {

        console.log("THE THIS: ", this);
        console.log("SOCKET CLIENTS: ", this.#socketServer.clients.size);
        const handlerFoo = this.socketPortalEventHandler.bind(null, ws);

        /**
         * Since this function is the callback use on the 'connection' event
         * of the WebSocketServer, the attribute 'this' refer to our
         * WebSocketServer object. So to access the methods and attributes of
         * our WebScketServer object... instead of 'this.#socketServer,
         * we will just use 'this'
         * 
         * In an event, 'this' refers to the element that received the event.
         * 
         * ***ONLY IN THIS FUNCTION***
        */

        console.log("LISTENING TO WEBSOCKET CONNECTION");
        try {
            let adminCrud = new AdminCrud();
            ActivityLogger.info("NEW WEBSOCKET CONNECTION ATTEMPT", { ip: req.socket.remoteAddress, url: req.url, method: req.method });

            // ws.onclose = (event) => {
            //     this.handleClose();
            // }

            // ws.on('close', this.handleClose);

            ws.onclose = (event) => {
                console.log("THE THIS IN CLOSE: ", this);
                // this.#socketServer.removeListener('connection');
                // socketPortalEvent.removeListener(socketPortalEvent.events.orderUpdate, this.socketPortalFoo);
                // socketPortalEvent.removeAllListeners(socketPortalEvent.events.orderUpdate);
                socketPortalEvent.removeListener(socketPortalEvent.events.orderUpdate, handlerFoo)
                this.#admins.delete(ws);
                ActivityLogger.info(`WEBSOCKET CONNECTION CLOSED. CLEANLY? ${event.wasClean}`, { ip: req.socket.remoteAddress, url: req.url, method: req.method });
            }

            ws.onmessage = (event) => {
                console.log("THE CLIENT MESSAGE: ", event.data);
                let adminUsername = validator.escape(event.data);
                console.log("ADMIN USERNAME IN SOCKET: ", adminUsername);
                adminCrud.read({ username: adminUsername })
                    .then((admin) => {
                        if (admin) {
                            console.log("FOUND USER");
                            ActivityLogger.info(`WEBSOCKET SUCCESSFULLY CONNECTED TO "${adminUsername}"`, { ip: req.socket.remoteAddress, url: req.url, method: req.method });

                            ws.send(JSON.stringify({ message: "Connection Etablished" }));


                            console.log("ASTER SEND REACHED!!!");
                            console.log("ADMIN SET: ", this.#admins);


                                socketPortalEvent.on(socketPortalEvent.events.orderUpdate, handlerFoo);

                                this.#admins.add(ws);
                                console.log("END OF NOT SOCKET EXISTING");
                            
                            console.log("ADMIN SET SIZE: ", this.#admins.size);
                            console.log("NUMBER OF LISTENER: ", socketPortalEvent.listenerCount(socketPortalEvent.events.orderUpdate));
                        
                        } else {
                            ActivityLogger.info("NO ADMIN FOUND ON WEBSOCKET CONNECTION ATTEMPT: CONNECTION CLOSED", { ip: req.socket.remoteAddress, url: req.url, method: req.method });
                            ws.send("Unable to connect");
                            ws.close();
                        }
                        // console.log("SOCKET CLIENTS: ", this.clients);
                    })
                    .catch((error) => {
                        ErrorLogger.error(error.message, { ip: req.socket.remoteAddress, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });

                        ws.send(JSON.stringify({ message: "Unable to connect" }));
                        ws.close();
                    });
            }






        } catch (error) {
            ErrorLogger.error(error.message, { ip: req.socket.remoteAddress, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
        }

    }
}


module.exports = AppWebsocket