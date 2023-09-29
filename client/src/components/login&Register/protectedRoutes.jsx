import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoutes = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/api/users/verify-token", { withCredentials: true })
            .then(response => {
                if (response.data.valid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                setLoading(false);
            })
            .catch(error => {
                setIsAuthenticated(false); 
                setLoading(false);
                navigate("/login", { replace: true });
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" replace/>
    );
};


export default ProtectedRoutes;
