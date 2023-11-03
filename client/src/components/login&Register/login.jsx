import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext.jsx';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import UserInfoDisplay from '../../developerTools/userInfoDisplay.jsx';
import Logout from './logout.jsx';

const Login = () => {

    const { user, setUser, setIsActive } = useUserContext();
    const { socket, connectSocket } = useSocketContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const currentSocket = connectSocket(); // Connect socket if not already connected

        const ensureSocketConnection = new Promise((resolve, reject) => {
            if (currentSocket && currentSocket.connected) { // If socket is already connected, resolve promise
                resolve();
            } else {
                currentSocket.on("connect", () => { // If socket is not connected, wait for it to connect and then resolve promise
                    resolve();
                });
                currentSocket.on("connect_error", (err) => {
                    reject(new Error("Socket connection failed"));
                });
            }
        });

        try {
            await ensureSocketConnection; // Wait for socket connection to be established so you can send the socket ID to the server

            axios.post("http://localhost:3001/api/users/login", {
                username,
                password,
                socketID: currentSocket.id
            }, { withCredentials: true })
                .then(res => {
                    const user = { ...res.data.user };
                    setIsActive(true);
                    setUser(user);
                    sessionStorage.setItem("user", JSON.stringify(user));
                    setUsername("");
                    setPassword("");
                    navigate("/loggedIn");
                })
                .catch(err => {
                    console.log(err);
                    if (err.response && err.response.data && err.response.data.message) {
                        setErrorMessage(err.response.data.message);
                    } else {
                        setErrorMessage("An unexpected error occurred. Please try again.");
                    }
                    setPassword("");
                });

        } catch (error) {
            console.error(error.message);
            setErrorMessage("Socket connection failed. Please try again.");
        }
    }


    const changeHandler = (e) => {
        setErrorMessage("");
        switch (e.target.name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Login</h1>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="username">Username: </label>
                            <input type="text" name="username" className="form-control" onChange={changeHandler} value={username} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password: </label>
                            <input type="password" name="password" className="form-control" onChange={changeHandler} value={password} />
                        </div>
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </form>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                    <UserInfoDisplay />
                    <Logout />
                </div>
            </div>
        </div>
    )
}

export default Login;
