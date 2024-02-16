import { useState, useEffect } from 'react';

export const useSocket = () => {
    const [socket, setSocket] = useState(new WebSocket('ws://localhost:3000/cable'));
    const [xPositionFromSocket, setXPositionFromSocket] = useState(null);
    const [yPositionFromSocket, setYPositionFromSocket] = useState(null);

    useEffect(() => {
        const handleSocketOpen = (event) => {
            console.log('Connected to the server');

            const message = {
                command: 'subscribe',
                identifier: JSON.stringify({
                    channel: 'VisualAlertChannel',
                }),
            };

            socket.send(JSON.stringify(message));
        };

        const handleSocketMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ping') {
                return;
            }

            // set position of the alert from socket
            if (data?.message?.type === 'alert') {
                setXPositionFromSocket(data.message.position.x);
                setYPositionFromSocket(data.message.position.y);
            }

            // debugging
            // if (data.message) {
            //     console.log('Received data from server', event.data);
            // }
        };

        const handleSocketClose = (event) => {
            console.log('Disconnected from server');
        };

        const handleSocketError = (error) => {
            console.log('WebSocket error observed: ', error);
        };

        socket.addEventListener('open', handleSocketOpen);
        socket.addEventListener('message', handleSocketMessage);
        socket.addEventListener('close', handleSocketClose);
        socket.addEventListener('error', handleSocketError);

        // Close the socket when the component unmounts
        return () => {
            console.log('Closing WebSocket connection');
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [socket]);

    return { xPositionFromSocket, yPositionFromSocket, socket, setSocket };
};

export const useVisualAlert = (socket) => {
    useEffect(() => {
        const handleVisualAlert = (event) => {
            if (event.ctrlKey) {
                const message = {
                    command: 'message',
                    identifier: JSON.stringify({
                        channel: 'VisualAlertChannel',
                    }),
                    data: JSON.stringify({ action: "visual_alert", position: {x: event.pageX, y: event.pageY} })
                };

                socket.send(JSON.stringify(message));
            }
        }

        document.addEventListener('click', handleVisualAlert);
        return () => {
            document.removeEventListener('click', handleVisualAlert);
        }
    }, [socket]);
}