import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from './SocketContext.jsx';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ id: null, username: null, avatar: null });
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { socket, disconnectSocket } = useSocketContext();

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true });
            if (response.data.message === "Logged out successfully") {
                setUser({ id: null, username: null, avatar: null });
                setIsActive(false);
                sessionStorage.clear();
                disconnectSocket();
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, isActive, setIsActive, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};