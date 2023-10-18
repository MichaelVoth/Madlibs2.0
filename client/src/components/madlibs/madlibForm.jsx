import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext.jsx";
import axios from "axios";

const MadlibForm = (props) => {

    const { user } = useUserContext();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [titleErrors, setTitleErrors] = useState("");
    const [bodyErrors, setBodyErrors] = useState("");
    const [summary, setSummary] = useState("");
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();

    const validateCurlyBraces = (text) => {
        const stack = [];
        for (let char of text) {
            if (char === "{") {
                stack.push(char);
            } else if (char === "}") {
                if (stack.length === 0 || stack[stack.length - 1] !== "{") {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.length < 2) {
            setTitleErrors("Title must be at least two characters");
            return;
        } else {
            setTitleErrors("");
        }

        if (body.length < 100) {
            setBodyErrors("Madlib text must be at least 100 characters");
            return;
        } else if (!validateCurlyBraces(body)) {
            setBodyErrors("Text must include balanced pairs of {}. Example: {noun} {verb} not {noun{verb}}");
            return;
        } else {
            setBodyErrors("");
        }
        axios.post("http://localhost:3001/api/templates/create", {
            title,
            body,
            summary,
            tags,
            authorID: user._id,
        }, { withCredentials: true })
    };

    return (
        <div>
            <h1>Madlib Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title: </label>
                    <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                    {titleErrors ? <p style={{ color: "red" }}>{titleErrors}</p> : null}
                    <label>Summary: </label>
                    <input type="text" onChange={(e) => setSummary(e.target.value)} value={summary} />
                    <label>Madlib Text: </label>
                    <textarea onChange={(e) => setBody(e.target.value)} value={body} />
                    <label>Tags: </label>
                    <input type="text" onChange={(e) => setTags(e.target.value.split(","))} value={tags} />
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default MadlibForm;