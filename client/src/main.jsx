import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
        <SocketProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </SocketProvider>
);
