import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from './components/login&Register/protectedRoutes';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import RoomView from './views/room.view.jsx';

import ProtectedPage from './developerTools/protectedPage';

function App() {


    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/loggedIn" element={<ProtectedRoutes />}>
                        <Route index path="" element={<Dashboard />} />
                        <Route path="protected" element={<ProtectedPage />} />
                        <Route path="room/:roomID" element={<RoomView />}/>
                    </Route>
                    <Route path="*" element={<Login />} /> {/* Default route */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
