import React, { useState } from 'react';
import { useUserContext } from '../../contexts/UserContext.jsx';
import { useSocketContext } from '../../contexts/SocketContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="username">Username: </label>
                            <input id="username" type="text" name="username" className="form-control" autoComplete='username' onChange={changeHandler} value={username} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password: </label>
                            <input id="password" type="password" name="password" className="form-control" autoComplete='current-password' onChange={changeHandler} value={password} />
                        </div>
                        <input type="submit" value="Login" className="btn btn-primary d-block mx-auto px-5" />
                    </form>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                </div>
            </div>
        </div>
    )
}

export default Login;
