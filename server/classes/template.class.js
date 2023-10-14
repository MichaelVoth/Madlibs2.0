

class Template {
    constructor(title, body, authorID, tags = [], isFeatured = false) {
        this.title = title;
        this.body = body;
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

    // ... other methods ...

    extractPromptsFromBody(body) {
        // Logic to extract prompts from the body and return them as an array
    }
}
