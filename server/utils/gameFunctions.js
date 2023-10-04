


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
    pullPromptsFromText
};
