import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from './components/login&Register/protectedRoutes';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import UserList from './components/userlist';
import AvatarModal from './forms/avatarModal';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';


function App() {
    return (
        <div className="App">
            <Router>
                <SocketProvider>
                    <UserProvider>
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
                    </UserProvider>
                </SocketProvider>
            </Router>
        </div>
    );
};

export default App;
