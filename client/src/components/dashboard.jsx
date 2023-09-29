import axios from 'axios';
import React, { useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';

const Dashboard = () => {

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const { user, isActive, setIsActive } = useContext(UserContext);

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.clear();
        setIsActive(false);
        axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
        navigate("/login");
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome {user && user.username}</p>
            <p>You are active: {isActive ? "Yes" : "No"}</p>
            <p>Token: {token}</p>
            <button onClick={logout}>Logout</button>
            <Link to="/userlist">User List</Link>
        </div>
    );
}

export default Dashboard;
