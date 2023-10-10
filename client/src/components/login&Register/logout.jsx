import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import { useSocketContext } from '../../contexts/SocketContext';

const Logout = () => {
    const navigate = useNavigate();
    const { user, setUser, setIsActive } = useUserContext();
    const { disconnectSocket } = useSocketContext();

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true });
            if (response.data.message === "Logged out successfully") {
                setUser();
                setIsActive(false);
                sessionStorage.clear("user");
                localStorage.clear("user");
                disconnectSocket();
                console.log("Logged out successfully");
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
