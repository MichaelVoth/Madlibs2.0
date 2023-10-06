import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from './components/login&Register/protectedRoutes';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import AvatarModal from './forms/avatarModal';

function App() {


    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/avatar" element={<AvatarModal />} />
                    <Route path="/loggedIn" element={<ProtectedRoutes />}>
                        <Route index path="" element={<Dashboard />} />
                        <Route path="rooms/:roomId"/>
                    </Route>
                    <Route path="*" element={<Login />} /> {/* Default route */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
