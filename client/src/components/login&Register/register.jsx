import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import isEmail from 'validator/lib/isEmail';
import AvatarModal from "../../forms/avatarModal";
import { UserContext } from "../../contexts/UserContext";



const Register = () => {

    const { user, setUser, setIsActive } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPW, setConfirmPW] = useState("");
    const [showAvatarModal, setShowAvatarModal] = useState(false);


    const validatePassword = (password) => {
        const regexUppercase = /[A-Z]/;
        const regexLowercase = /[a-z]/;
        const regexNumber = /[0-9]/;
        const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!regexUppercase.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!regexLowercase.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!regexNumber.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!regexSpecial.test(password)) {
            return "Password must contain at least one special character.";
        }
        return ""; // Return empty string if all criteria are met
    }

    const confirmPassword = (password, confirmPW) => {
        return password === confirmPW;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }
        if (!isEmail(email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError("");
        }
        if (!confirmPassword(password, confirmPW)) {
            setPasswordError("Passwords do not match");
            return;
        } else {
            setPasswordError("");
        }
        axios.post("http://localhost:3001/api/users/register", {
            username,
            email,
            password
        }, { withCredentials: true }) // sends the cookie
            .then(res => {
                console.log(res);
                const userData = res.data.user;
                setUser(userData);
                setIsActive(true);
                setShowAvatarModal(true); // Show avatar modal
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPW("");
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        console.log("User",user);
    }, [user]);

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
                            {emailError && <p className="text-danger">{emailError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password: </label>
                            <input type="password" name="password" className="form-control" onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password: </label>
                            <input type="password" name="confirmPassword" className="form-control" onChange={changeHandler} />
                            {passwordError && <p className="text-danger">{passwordError}</p>}
                        </div>
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </form>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
            {showAvatarModal && <AvatarModal show={showAvatarModal} />}

        </div>
    )
}

export default Register;
