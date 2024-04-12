function websocketClient() {
    const webSocket = new WebSocket('ws://192.168.0.114:2971/');

    webSocket.onopen = (event) => {
        const adminUsername = document.querySelector('.username-section h3');
    
        console.log("ADMIN NAME: ", adminUsername.textContent);
        webSocket.send(adminUsername.textContent);
        // webSocket.close();
    }
    webSocket.onmessage = (event) => {
        console.log("MESSAGE FROM SERVER: ", event.data);
    }
    webSocket.onclose = (event) => {
        console.log("SOCKET CLOSED");
    }
}

export {
    websocketClient
};