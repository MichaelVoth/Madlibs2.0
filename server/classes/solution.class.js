import Solution from "../models/solution.model.js";
import Template from '../models/template.model.js';

class SolutionClass {
    constructor(templateID, title, contributors, filledPrompts) {
        this.templateID = templateID;
        this.title = title;
        this.contributors = contributors.map(userID => ({ user: userID }))
        this.filledPrompts = filledPrompts;
    }

    async renderMadlib() {
        const template = await Template.findById(this.templateID);
        let completedText = template.body;
        this.filledPrompts.forEach(({ prompt, response }) => {
            const regex = new RegExp(`\{${prompt}\}`);
            completedText = completedText.replace(regex, response);
        });
        return completedText;
    }

    async createSolution() {
        const completedText = await this.renderMadlib();
        this.completedText = completedText;
        const solution = new Solution({
            templateID: this.templateID,
            title: this.title,
            contributors: this.contributors,
            filledPrompts: this.filledPrompts,
            completedText: completedText
        });
        await solution.save();
        return solution
    }

    getCompletedText() {
        return this.completedText;
    }

    // Add other methods as needed
}

export default SolutionClass;
