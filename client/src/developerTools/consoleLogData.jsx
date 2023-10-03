import React, { useState } from 'react';
import { useUserContext } from '../contexts/UserContext.jsx';
import { useSocketContext } from '../contexts/SocketContext.jsx';

const ConsoleLog = () => {

    const { user } = useUserContext();
    const { socket } = useSocketContext();

    const consoleLogData = () => {
        console.log("user:", user);
        console.log("socket:", socket);
        console.log("Session Storage:", sessionStorage);
        console.log("Local Storage:", localStorage);
    }

    return (
        <button onClick={consoleLogData}>Console Log Data</button>
    );

};

export default ConsoleLog;
