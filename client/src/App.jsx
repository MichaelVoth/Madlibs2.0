import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from './components/login&Register/protectedRoutes';
import DashboardView from './views/dashboard.view.jsx';
import LoginView from './views/login.view.jsx';
import Register from './components/login&Register/register';
import RoomView from './views/room.view.jsx';
import MadlibForm from './components/madlibs/madlibForm.jsx';

import ProtectedPage from './developerTools/protectedPage';

function App() {


    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/loggedIn" element={<ProtectedRoutes />}>
                        <Route index path="" element={<DashboardView />} />
                        <Route path="protected" element={<ProtectedPage />} />
                        <Route path="madlib/create" element= {<MadlibForm />} />
                        <Route path="room/:roomID" element={<RoomView />}/>
                    </Route>
                    <Route path="*" element={<LoginView />} /> {/* Default route */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
