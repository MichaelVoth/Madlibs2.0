class PlayerClass {
    constructor(id, socketId, username, avatar) {
        this.id = id || '';
        this.socketId = socketId || '';
        this.isActive = false;
        this.username = username || '';
        this.avatar = avatar || '';
        this.isAdmin = false;
    }
}

class UserClass extends PlayerClass {
    constructor(id, socketId, username, avatar, token) {
        super(id, socketId, username, avatar);
        this.token = token || '';
        this.notifications = [];
        this.friends = [];
        this.activeFriends = [];
        this.accountStatus = 'active'; // default value
    }

    //add methods specific to User here, e.g., sendFriendRequest, addNotification, etc.
}

class AdminClass extends UserClass {
    constructor(id, socketId, username, avatar, token) {
        super(id, socketId, username, avatar, token);
        this.isAdmin = true;
    }

    // You can add methods specific to Admin here, e.g., banUser, manageContent, etc.
}
export { UserClass, AdminClass, PlayerClass };