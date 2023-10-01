import React, { createContext, useState, useContext, useEffect } from "react";
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Check session storage for a stored user with a socket ID
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser && storedUser.socketId) {
            connectSocket(storedUser.socketId);
        }
    }, []);

    const connectSocket = (existingSocketId) => {
        if (!socket) {
            const newSocket = io.connect('http://localhost:3001', {
                query: { socketId: existingSocketId } // Pass the existing socket ID if available
            });
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log(`Connected to the server with id: ${newSocket.id}`);
                // Update the user in session storage with the new socket ID
                const storedUser = JSON.parse(sessionStorage.getItem("user"));
                if (storedUser) {
                    storedUser.socketId = newSocket.id;
                    sessionStorage.setItem("user", JSON.stringify(storedUser));
                }
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
            // Clear the socket ID from the user in session storage on disconnect
            const storedUser = JSON.parse(sessionStorage.getItem("user"));
            if (storedUser) {
                delete storedUser.socketId;
                sessionStorage.setItem("user", JSON.stringify(storedUser));
            }
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
