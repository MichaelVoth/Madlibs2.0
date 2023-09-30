import { createContext } from "react";
import io from 'socket.io-client'

export const socket = io.connect('http://localhost:3001')
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

socket.on("connect", () => {
    console.log(`Connected to the server with id: ${socket.id}`);
});

socket.on("connect_error", (err) => {
    console.log(`Connection failed due to error: ${err.message}`);
});