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

    constructor() {
        this.#socketServer = new WebSocket.Server({ port: 2971 });
        this.#socketServer.on('close', () => {
            ActivityLogger.info("SOCKET SERVER CLOSED!");
        });
    }

    connection() {
        this.#socketServer.on('connection', this.webSocketController);
    }

    close() {
        this.#socketServer.close();
    }

    /**
    * 
    * @param {WebSocket} ws 
    * @param {http.IncomingMessage} req 
    */
    webSocketController(ws, req) {
        try {

            let adminCrud = new AdminCrud();
            ActivityLogger.info("NEW WEBSOCKET CONNECTION ATTEMPT", { ip: req.socket.remoteAddress, url: req.url, method: req.method });

            ws.onclose = (event) => {
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
                            ws.send("Connection Etablished");
                        } else {
                            ActivityLogger.info("NO ADMIN FOUND ON WEBSOCKET CONNECTION ATTEMPT: CONNECTION CLOSED", { ip: req.socket.remoteAddress, url: req.url, method: req.method });
                            ws.send("Unable to connect");
                            ws.close();
                        }
                    })
                    .catch((error) => {
                        ErrorLogger.error(error.message, { ip: req.socket.remoteAddress, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
                        ws.send("Unable to connect");
                        ws.close();
                    });
            }
            console.log("WIDE SOCKET CONNECTION");
            
            socketPortalEvent.on(socketPortalEvent.events.orderUpdate, () => {
                console.log("SOCKET GOT ORDER CHANGE");
                ws.send("NEW ORDER UPDATE");
            });


        } catch (error) {
            ErrorLogger.error(error.message, { ip: req.socket.remoteAddress, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
        }

    }
}


module.exports = AppWebsocket