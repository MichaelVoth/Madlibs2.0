import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
    // Check sessionStorage for user data on initial load
    const storedUser = sessionStorage.getItem('user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    const [user, setUser] = useState(initialUser); 
    const [isActive, setIsActive] = useState();

    // Whenever the user state changes, update sessionStorage
    useEffect(() => {
        if (user) { // If user is not null
            setIsActive(true);
            sessionStorage.setItem('user', JSON.stringify(user)); // Update sessionStorage
        } else { // If user is null
            sessionStorage.removeItem('user'); // Remove user from sessionStorage
            setIsActive(false);
        }
    }, [user]);

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
