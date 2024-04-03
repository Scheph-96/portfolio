function websocketClient() {
    const webSocket = new WebSocket('ws://192.168.0.114:2971/');

    webSocket.onmessage = (event) => {
        console.log("MESSAGE FROM SERVER: ", event.data);
    }
}

export {
    websocketClient
};