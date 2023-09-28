import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const isAuthenticated = sessionStorage.getItem("token"); // Check if the token exists in sessionStorage

    return (
        <Route {...props} element={
            isAuthenticated ? props.element : <Navigate to="/login" replace />
        } />
    );
};

export default ProtectedRoute;
