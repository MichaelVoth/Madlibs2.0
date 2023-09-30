import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext.jsx';

const UserList = () => {
    const [users, setUsers] = useState([]);

    const { logout } = useUserContext();

    useEffect(() => {
        // console.log(`Fetching users..., token: ${token}`);
        axios.get('http://localhost:3001/api/users/all', { withCredentials: true })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
    }, []);

    return (
        <div>
            <h2>Users List</h2>
            <button onClick={logout}>Logout</button>
            <Link to="/dashboard">Dashboard</Link>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
