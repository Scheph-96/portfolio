import { orderUpdateHandler } from "./socket_data_handler.js";

function websocketClient() {
    const webSocket = new WebSocket('ws://192.168.0.114:2971/');
    let serverData;

    webSocket.onerror = (event) => {
        console.log("SOCKET ERROR");
    }

    webSocket.onopen = (event) => {
        const adminUsername = document.querySelector('.username-section h3');

        console.log("ADMIN NAME: ", adminUsername.textContent);
        webSocket.send(adminUsername.textContent);
        // webSocket.close();
    }
    webSocket.onmessage = (event) => {
        console.log("THE TYPE: ", typeof event.data);

        serverData = JSON.parse(event.data);
        console.log("SERVER DATA: ", serverData);

        console.log("MESSAGE FROM SERVER: ", serverData.message);

        if (serverData.packet) {
            console.log("SERVER PACKET: ", serverData.packet);

            if (serverData.packet.type === 'order') {
                orderUpdateHandler(serverData.packet.data);
            }
        }
        // if(event.data.packet) {
        //     console.log("UPDATE DATA: ", JSON.parse(event.data));
        // }
    }
    webSocket.onclose = (event) => {
        console.log("SOCKET CLOSED");
    }
}

export {
    websocketClient
};