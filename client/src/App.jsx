import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard';
import Login from './components/login&Register/login';
import Register from './components/login&Register/register';
import UserList from './components/userlist';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="*" element={<Login />} /> {/* Default route */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/userlist" element={<UserList />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
