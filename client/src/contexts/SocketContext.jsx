import React, { createContext, useState, useContext, useEffect } from "react";
import io from 'socket.io-client';
import { useUserContext } from './UserContext.jsx';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, setUser } = useUserContext();

    useEffect(() => {
        let newSocket;
        if (user && user.socketId) { // If user is not null and has a socketId
            newSocket = io.connect('http://localhost:3001'); // Connect to socket server
            setSocket(newSocket); // Set socket state to newSocket

            if (newSocket) { // If newSocket is not null
                newSocket.on("connect", () => { // When socket connects
                    if (user) { // If user is not null
                        user.socketID = newSocket.id; // Update user's socketID
                        setUser({...user, socketId: newSocket.id }); // Update user state
                        sessionStorage.setItem("user", JSON.stringify(user)); // Update sessionStorage
                        newSocket.emit("associate_socket_with_user", user.id); // Associate socket with user
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
            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
        }
    }, [user, setUser]);

    const connectSocket = () => {
        if (!socket) {
            const existingSocketId = user?.socketId;
            const newSocket = io.connect('http://localhost:3001', {
                query: { socketId: existingSocketId }
            });
            setSocket(newSocket);
            return newSocket;
        }
        return socket;
    };
    

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);

            const user = JSON.parse(sessionStorage.getItem("user"));
            if (user) {
                delete user.socketId;
                sessionStorage.setItem("user", JSON.stringify(user));
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
