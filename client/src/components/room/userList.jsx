import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './userCard';

const UserList = (props) => {
    const [usersInRoom, setUsersInRoom] = useState(props.usersInRoom);
    const navigate = useNavigate();

    useEffect(() => {
        setUsersInRoom(props.usersInRoom);

        return () => {
            setUsersInRoom([]);
        };
    }, [props.usersInRoom]);

    return (
        <div>
            <h3>Users in room:</h3>
            <ul style={{ listStyleType: "none" }}>
                {usersInRoom.map((user) => (
                    <UserCard key={user.userID} name={user.username} color={user.avatar} />
                ))}
            </ul>
        </div>
    );
};

export default UserList;

