import React, { useState } from "react";
import Login from "../components/login&Register/login.jsx";
import Register from "../components/login&Register/register.jsx";
import MadlibLogo from "../assets/madlibBanner.png";

import Col from "react-bootstrap/esm/Col.js";
import Row from "react-bootstrap/esm/Row.js";
import Card from "react-bootstrap/esm/Card.js";

import Logout from "../components/login&Register/logout.jsx";
import UserInfoDisplay from "../developerTools/userInfoDisplay.jsx";

const LoginView = () => {

    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => {
        setIsLoginView(!isLoginView);
    }

    return (
        <div>
            <Logout />
            <div className="center-container">
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Card className="login-card">
                            <img className="madlib-logo" src={MadlibLogo} alt="Madlib Logo" />
                            {isLoginView ? <Login /> : <Register />}
                            <div className="toggle-link d-block mx-auto" onClick={toggleView}>
                                {isLoginView ?
                                    <>Don't have an account? <span>Register</span></> :
                                    <>Already have an account? <span>Login</span></>
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <UserInfoDisplay />
        </div>
    )
}

export default LoginView;