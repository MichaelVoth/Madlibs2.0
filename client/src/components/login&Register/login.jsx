import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/users/login", {
            username,
            password
        }, { withCredentials: true }) // sends the cookie
            .then(res => {
                console.log(res);
                sessionStorage.setItem("token", res.data.token);
                setUsername("");
                setPassword("");
                navigate("/dashboard");
            })
            .catch(err => { 
                console.log(err);
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            });
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
                <div className="col-6">
                    <h1>Login</h1>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;