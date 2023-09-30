class PlayerClass {
    constructor(id, username, avatar) {
        this.id = id || '';
        this.isActive = false;
        this.username = username || '';
        this.avatar = avatar || '';
        this.isAdmin = false;
    }
}

class UserClass extends PlayerClass {
    constructor(id, username, avatar) {
        super(id, username, avatar);
        this.notifications = [];
        this.friends = [];
        this.activeFriends = [];
        this.accountStatus = 'active';
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