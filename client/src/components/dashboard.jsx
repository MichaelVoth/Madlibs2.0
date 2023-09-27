import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <h1>Dashboard</h1>
                    
                    <Link to="/logout">Logout</Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;