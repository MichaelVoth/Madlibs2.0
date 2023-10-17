import React from "react";
import blueAvatar from "../assets/blueAvatar.png";
import greenAvatar from "../assets/greenAvatar.png";
import orangeAvatar from "../assets/orangeAvatar.png";
import pinkAvatar from "../assets/pinkAvatar.png";
import purpleAvatar from "../assets/purpleAvatar.png";
import yellowAvatar from "../assets/yellowAvatar.png";

const Avatar = ({ color, className }) => {


    const avatarList = [ // List of avatars to choose from
    { color: "blue", image: blueAvatar },
    { color: "green", image: greenAvatar },
    { color: "orange", image: orangeAvatar },
    { color: "pink", image: pinkAvatar },
    { color: "purple", image: purpleAvatar },
    { color: "yellow", image: yellowAvatar },
];
const userAvatar = avatarList.find(avatar => avatar.color === color);

    return (
        <div>
            {userAvatar && <img className={className} src={userAvatar.image} alt={userAvatar.color} />}
        </div>
    );
}

export default Avatar;