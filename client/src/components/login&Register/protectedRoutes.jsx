import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = (props) => {
    const isAuthenticated = sessionStorage.getItem("token"); // Check if the token exists in sessionStorage

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    );
};

export default ProtectedRoutes;
