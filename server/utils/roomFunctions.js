// Generate a unique room code for a new room
const generateRoomCode = (rooms) => {
    const makeKey = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    let newKey;
    let attempts = 0;
    const maxAttempts = 100; // arbitrary number to prevent infinite loops

    do {
        newKey = makeKey();
        attempts++;
    } while (rooms[newKey] && attempts < maxAttempts);

    if (attempts === maxAttempts) {
        throw new Error("Failed to generate a unique room code.");
    }

    return newKey;
};

export {
    generateRoomCode
};