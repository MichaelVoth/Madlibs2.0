import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/login&Register/ProtectedRoute';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import UserList from './components/userlist';
import { UserProvider } from './contexts/UserContext';


function App() {
    return (
        <div className="App">
            <Router>
                <UserProvider>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/userlist" element={<UserList />} />
                        <Route path="*" element={<Login />} /> {/* Default route */}
                    </Routes>
                </UserProvider>
            </Router>
        </div>
    );
}


export default App;
