import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/all')
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
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} - {user.email} - {user.password}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
