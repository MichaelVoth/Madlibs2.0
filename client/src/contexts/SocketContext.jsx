import React, { createContext, useState, useContext } from "react";
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const connectSocket = () => {
        if (!socket) {
            const newSocket = io.connect('http://localhost:3001');
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log(`Connected to the server with id: ${newSocket.id}`);
            });

            newSocket.on("connect_error", (err) => {
                console.log(`Connection failed due to error: ${err.message}`);
            });
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }
    return context;
};
