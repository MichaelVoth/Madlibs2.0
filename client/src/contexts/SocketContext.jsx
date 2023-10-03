import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserContext } from "./UserContext";
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const { user } = storedUser || {};
    
    useEffect(() => {
        // Initialize socket connection
        const newSocket = io.connect('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log(`Connected with ID: ${newSocket.id}`);
            if (user) {
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


        return () => { // This returned function will run when the component unmounts
            newSocket.disconnect();
        };

    }, [user]); // Only run this hook once, after initial render

    const connectSocket = () => {
        if (!socket) { // Check that socket is null
            const existingSocketId = storedUser?.socketId; // Get the socket ID from session storage
            const newSocket = io.connect('http://localhost:3001', { // Connect to the server with the socket ID
                query: { socketId: existingSocketId } // Send the socket ID as a query parameter
            });
            setSocket(newSocket); // Set the socket state to the new socket

            newSocket.on("connect", () => {
                console.log(`Connected to the server with id: ${newSocket.id}`);
                const storedUser = JSON.parse(sessionStorage.getItem("user")); // Get the user from session storage
                if (storedUser) { // Check that user is not null
                    storedUser.socketId = newSocket.id; // Add the socket ID to the user object
                    sessionStorage.setItem("user", JSON.stringify(storedUser)); // Update the user in session storage
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

            const storedUser = JSON.parse(sessionStorage.getItem("user")); // Get the user from session storage
            if (storedUser) { // Check that user is not null
                delete storedUser.socketId; // Delete the socket ID from the user object
                sessionStorage.setItem("user", JSON.stringify(storedUser)); // Update the user in session storage
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
