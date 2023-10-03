import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(); 
    const [isActive, setIsActive] = useState(false);


    return (
        <UserContext.Provider value={{ user, setUser, isActive, setIsActive }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};