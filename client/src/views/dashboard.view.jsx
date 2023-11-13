import React, {useState} from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card";
import Dashboard from "../components/dashboard";

const DashboarcView = () => {

    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div>
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
