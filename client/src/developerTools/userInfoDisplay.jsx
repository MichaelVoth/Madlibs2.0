import React, {useState, useEffect} from 'react';

function UserInfoDisplay() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        setUserInfo(user);
    }, []);

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h3>User Info</h3>
            {userInfo ? (
                <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            ) : (
                <p>No user info found in session storage.</p>
            )}
        </div>
    );
}

export default UserInfoDisplay;
