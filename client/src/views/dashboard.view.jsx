import React, {useState} from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card";
import Dashboard from "../components/dashboard";
import NavBar from "../components/navbar";

const DashboarcView = () => {

    return (
        <div>
            <NavBar/>
            <div className="center-container">
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Card>
                            <Dashboard />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default DashboarcView;
