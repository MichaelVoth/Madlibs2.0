import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from './components/login&Register/protectedRoutes';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import UserList from './components/userlist';
import AvatarModal from './forms/avatarModal';
import { useUserContext } from './contexts/UserContext';
import { useSocketContext } from './contexts/SocketContext';

function App() {
    const { user, setUser, setIsActive } = useUserContext();
    const { socket, connectSocket } = useSocketContext();

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setIsActive(true);
            connectSocket();
        }
    }, []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/avatar" element={<AvatarModal />} />
                    <Route path="/userlist" element={<ProtectedRoutes />}>
                        <Route index element={<UserList />} />
                    </Route>
                    <Route path="*" element={<Login />} /> {/* Default route */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
