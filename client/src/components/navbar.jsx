import React from "react";
import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';
import Avatar from "./avatar.jsx";
import Logout from "./login&Register/logout.jsx";
import madlibHead from "../assets/madlibsHeadOnly.png";
import { Link } from "react-router-dom";


const NavBar = () => {
    const { user } = useUserContext();
    const { socket } = useSocketContext();

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <img src={madlibHead} alt="madlibHead" width="30px" />
                    <a className="navbar-brand" href="/loggedIn">Madlibs</a>


                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/loggedIn/madlib/create">Create Madlib</a>
                            </li>
                            </ul>
                            <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
                            <li className="nav-item">

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Avatar color={user.avatar} className="avatar-image-small" />
                                    <a className="nav-link" href="#">Welcome {user && user.username}</a>
                                </div>
                            </li>
                            
                        </ul>
                        <Logout />

                </div>
            </nav>
        </div>
    )
}

export default NavBar;