const { WebSocketServer } = require('ws');
const http = require("http");
const WebSocketMaxUserError = require('./errors/websocket_max_user');
const util = require('util');

const { ActivityLogger, ErrorLogger } = require('./tools/util.tool');


const socketServer = new WebSocketServer({ port: 2971 });

/** 
 * Define a list and limit it size to 1
 * The length property is marked as not writable
 * so that when a something is add to the list
 * with the push it throw::
 * TypeError: Cannot assign to read only property 'length' of object '[object Array]'
 * The length is unchangable amking it impossible to add another value
 * to the.
 * But doint userList[1] = "something" doesn't add anything and no error
 * is thrown
 */
const userList = [];
userList.length = 1;
Object.defineProperty(userList, 'length', { writable: false });

/**
 * 
 * @param {WebSocket} ws 
 * @param {http.IncomingMessage} req 
 */
function webSocketController(ws, req) {
    try {
        console.log(`NEW CONNECTION:: WEBSOCKET => ${ws}`);
        ActivityLogger.info("NEW WEBSOCKET CONNECTION ATTEMPT", { ip: req.socket.remoteAddress, url: req.url, method: req.method });
        console.log("ZI IP ADDRESS: ", req.socket.remoteAddress);

        if (userList[0] == ws) {
            console.log("SAME SOCKET");
        } else {
            console.log("DIFF SOCKET");
        }

        if (userList[0] == undefined) {
            userList[0] = ws;
            // Send message on user connection
            ws.send("Connection Etablished");
            ActivityLogger.info("NEW WEBSOCKET CONNECTED", { ip: req.socket.remoteAddress, url: req.url, method: req.method });
        } else {
            ActivityLogger.info("NEW WEBSOCKET CONNECTION FAILED", { ip: req.socket.remoteAddress, url: req.url, method: req.method });
            ws.send("Maximum number of authorized users reached!");
            throw new WebSocketMaxUserError("Maximum number of authorized users reached!");
            
        }

    } catch (error) {
        ErrorLogger.error(error.message, { ip: req.socket.remoteAddress, url: req.url, method: req.method, stacktrace: util.inspect(error, { showHidden: false, depth: null, colors: true }) });
    }

}

module.exports = {
    socketServer: socketServer,
    webSocketController: webSocketController,
}