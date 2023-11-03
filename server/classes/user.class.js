

class PlayerClass {
    constructor(id, socketID, username, avatar, isActive) {
        this.id = id || '';
        this.socketID = socketID || '';
        this.username = username || '';
        this.avatar = avatar || '';
        this.isActive = isActive;
        this.isAdmin = false;
    }
}

class UserClass extends PlayerClass {
    constructor(id, username, avatar, isActive, email, notifications, friends, activeFriends, accountStatus) {
        super(id, username, avatar, isActive);
        this.email = email || '';
        this.notifications = notifications || [];
        this.friends = friends || [];
        this.activeFriends = activeFriends || [];
        this.accountStatus = accountStatus || 'active';
    }

    setAvatar(avatar) {
        this.avatar = avatar;
    }
}

class AdminClass extends UserClass {
    constructor(id, username, avatar) {
        super(id, username, avatar);
        this.isAdmin = true;
    }

}
export { UserClass, AdminClass, PlayerClass };