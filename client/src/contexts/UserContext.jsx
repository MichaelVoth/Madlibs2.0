import React, { createContext, useState } from 'react';

export const UserContext = createContext(); // create a context object

export const UserProvider = ({ children }) => { // create a provider for the context object
    const [user, setUser] = useState(null); // set the initial state of the context object
    const [isActive, setIsActive] = useState(false); // set the initial state of the context object

    return (
        <UserContext.Provider value={{ user, setUser, isActive, setIsActive }}>  
            {children}
        </UserContext.Provider>
    );
};