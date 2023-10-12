import React from "react";
import Avatar from "../avatar.jsx";

const UserCard = ({ name, color }) => {

        return (
            <div className="user-card">
                <Avatar color = {color} className="avatar-image-small" />
                <p>{name}</p>
                {/* TO DO: Add icons for friend requests, etc. */}
            </div>
        );
    }

export default UserCard;