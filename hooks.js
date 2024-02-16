import {useEffect, useState} from 'react';
import useWebSocket from "react-use-websocket";

export const useSocket = (socketUrl) => {
    const [xPositionFromSocket, setXPositionFromSocket] = useState(null)
    const [yPositionFromSocket, setYPositionFromSocket] = useState(null)
    const handleSocketMessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "ping") {
            return;
        }

        // set position of the alert from socket
        if (data?.message?.type === "alert") {
            setXPositionFromSocket(data.message.position.x)
            setYPositionFromSocket(data.message.position.y)
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

    const {
        sendMessage,
        lastMessage,
        readyState,
        sendJsonMessage,
        lastJsonMessage
    } = useWebSocket(socketUrl,
        {
            onOpen: () => {
                console.log('Connected to the server');

                const message = {
                    command: 'subscribe',
                    identifier: JSON.stringify({
                        channel: 'VisualAlertChannel',
                    }),
                };

                sendJsonMessage(message);
            },
            shouldReconnect: () => true,
            onMessage: (event) => handleSocketMessage(event),
            onClose: () => handleSocketClose,
            onError: () => handleSocketError
        });

    return {
        sendMessage,
        lastMessage,
        readyState,
        sendJsonMessage,
        lastJsonMessage,
        xPositionFromSocket,
        yPositionFromSocket
    };
}

export const useVisualAlert = (sendJsonMessage) => {
    useEffect(() => {

        const handleVisualAlert = (event) => {
            if (event.ctrlKey) {
                const message = {
                    command: 'message',
                    identifier: JSON.stringify({
                        channel: 'VisualAlertChannel',
                    }),
                    data: JSON.stringify({action: "visual_alert", position: {x: event.pageX, y: event.pageY}})
                };

                sendJsonMessage(message);
            }
        }

        document.addEventListener('click', handleVisualAlert);
        return () => {
            document.removeEventListener('click', handleVisualAlert);
        }
    }, []);
}