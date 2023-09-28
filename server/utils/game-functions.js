
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

const distributePrompts = (prompts, users) => {
    if (!Array.isArray(prompts) || !Array.isArray(users)) {
        throw new Error("Invalid inputs. Prompts and users should be arrays.");
    }

    return prompts.reduce((acc, prompt, index) => {
        const user = users[index % users.length];
        if (!acc[user]) acc[user] = [];
        acc[user].push({ index, prompt });
        return acc;
    }, {});
};

const pullPromptsFromText = (text) => {
    const regex = /\{(.*?)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
};

export {
    distributePrompts,
    generateRoomCode,
    pullPromptsFromText
};
