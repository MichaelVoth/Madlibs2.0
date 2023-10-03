import React, { createContext, useState, useContext, useEffect } from "react";
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("user")); // Get user from sessionStorage

    useEffect(() => {
        let newSocket;
        if (user && user.socketId) { // Check that user and user.socketId are not null
            newSocket = io.connect('http://localhost:3001');
            setSocket(newSocket);

            if (newSocket) {  // Check if newSocket is defined before attaching event listeners
                newSocket.on("connect", () => {
                    console.log(`Connected with ID: ${newSocket.id}`);
                    if (user) {
                        sessionStorage.setItem("user", JSON.stringify(user));
                        // If there's a user in context, emit an event to the server to associate this socket ID with the user.
                        newSocket.emit("associate_socket_with_user", user.id);
                    }
                });

                newSocket.on("disconnect", () => {
                    console.log(`Disconnected from server`);
                });

                newSocket.on("reconnect", () => {
                    console.log(`Reconnected with ID: ${newSocket.id}`);
                    if (user) {
                        newSocket.emit("associate_socket_with_user", user.id);
                    }
                });
            }

            return () => { // This returned function will run when the component unmounts
                if (newSocket) {  // Check if newSocket is defined before disconnecting
                    newSocket.disconnect();
                }
            };
        }
    }, []); // Only run this hook once, after initial render

    const connectSocket = () => {
        if (!socket) { // Check that socket is null
            const existingSocketId = user?.socketId; // Get the socket ID from session storage
            const newSocket = io.connect('http://localhost:3001', { // Connect to the server with the socket ID
                query: { socketId: existingSocketId } // Send the socket ID as a query parameter
            });
            setSocket(newSocket); // Set the socket state to the new socket

            newSocket.on("connect", () => { // Add event listener for when the socket connects
                console.log(`Connected to the server with id: ${newSocket.id}`);
                const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from session storage
                if (user) { // Check that user is not null
                    user.socketId = newSocket.id; // Add the socket ID to the user object
                    sessionStorage.setItem("user", JSON.stringify(user)); // Update the user in session storage
                }
            });

            newSocket.on("connect_error", (err) => {
                console.log(`Connection failed due to error: ${err.message}`);
            });
        }
    };

    const disconnectSocket = () => {
        if (socket) { // Check that socket is not null
            socket.disconnect(); // Disconnect the socket
            setSocket(null); // Set socket state to null

            const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from session storage
            if (user) { // Check that user is not null
                delete user.socketId; // Delete the socket ID from the user object
                sessionStorage.setItem("user", JSON.stringify(user)); // Update the user in session storage
            }
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => { // Custom hook to use the socket context
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }
    return context;
};
