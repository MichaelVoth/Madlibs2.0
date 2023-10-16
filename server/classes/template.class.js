

class TemplateClass {
    constructor(title, body, summary, authorID, tags = [], isFeatured = false) {
        this.title = title;
        this.body = body;
        this.summary = summary;
        this.prompts = this.extractPromptsFromBody(body);
        this.authorID = authorID;
        this.rating = {
            average: 0,
            count: 0
        };
        this.tags = tags;
        this.views = 0;
        this.isFeatured = isFeatured;
    }

    extractPromptsFromBody = (text) => {
        const regex = /\{([^}]+)\}/g; // Matches all occurrences of text between curly brackets
        let match;
        const prompts = [];
        while ((match = regex.exec(text)) !== null) {
            prompts.push(match[1].trim()); // Add the matched prompt (without curly brackets) to the prompts array
        }
        return prompts;
    }

    renderMadlib(answers) {
        let renderedText = this.body;
        this.prompts.forEach((prompt, index) => {
            const answer = answers[index] || `{${prompt}}`; // Use the original prompt if no answer is provided
            renderedText = renderedText.replace(`{${prompt}}`, answer);
        });
        return renderedText;
    }

    getPromptCount() {
        return this.prompts.length;
    }

    validateAnswers(answers) {
        return answers.length === this.prompts.length;
    }

    addRating(rating) {
        const totalRating = this.rating.average * this.rating.count;
        this.rating.count++;
        this.rating.average = (totalRating + rating) / this.rating.count;
    }

    addView() {
        this.views++;
    }

    addTags(inputString) {
        let tags = inputString.split(',');
        tags = tags.map(tag => tag.trim()).filter(tag => tag !== "");
        tags = [...new Set(tags)];
        this.tags.push(...tags);
    }
    removeTag(tagToRemove) {
        this.tags = this.tags.filter(tag => tag !== tagToRemove);
    }
    getTags() {
        return this.tags;
    }

    getAuthorID() {
        return this.authorID;
    }

    getSummary() {
        return this.summary;
    }

    getRating() {
        return this.rating;
    }

    updateTemplate(newTitle, newBody, newSummary, newTags) {
        this.title = newTitle || this.title;
        this.body = newBody || this.body;
        this.summary = newSummary || this.summary;
        this.prompts = this.extractPromptsFromBody(this.body);
        this.addTags(newTags);
    }
}

export default TemplateClass;
