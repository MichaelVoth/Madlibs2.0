import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import isEmail from 'validator/lib/isEmail';

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPW, setConfirmPW] = useState("");

    const navigate = useNavigate();

    const confirmPassword = (password, confirmPW) => {
        return password === confirmPW;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!confirmPassword(password, confirmPW)) {
            alert("Passwords do not match!");
            return;
        }
        if (!isEmail(email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError("");
        }
        axios.post("http://localhost:8000/api/register", {
            username,
            email,
            password
        }, { withCredentials: true }) // sends the cookie
            .then(res => {
                console.log(res);
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPW("");
                navigate("/dashboard");
            })
            .catch(err => console.log(err));
    }


    const changeHandler = (e) => {
        switch (e.target.name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            case "confirmPassword":
                setConfirmPW(e.target.value);
                break;
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <h1>Register</h1>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="username">Username: </label>
                            <input type="text" name="username" className="form-control" onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email: </label>
                            <input type="text" name="email" className="form-control" onChange={changeHandler} />
                            {emailError && <p className="text-danger">{emailError}</p>} {/* conditional rendering */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password: </label>
                            <input type="password" name="password" className="form-control" onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password: </label>
                            <input type="password" name="confirmPassword" className="form-control" onChange={changeHandler} />
                        </div>
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </form>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;
