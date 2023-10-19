import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext.jsx";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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

    const handleCancel = () => {
        navigate("/loggedIn");
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
            authorID: user.id,
        }, { withCredentials: true })
            .then((res) => {
                navigate("/loggedIn");
            }
            )
            .catch((err) => {
                console.log(err);
            }
            );

    };

    return (
        <div>
            <h1>Madlib Form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        className="mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {titleErrors && <p style={{ color: "red" }}>{titleErrors}</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Summary</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        className="mb-2"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Madlib</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        className="mb-2"
                        value={body}
                        placeholder="Enter MadLib text here. Use {} around the word you'd like replace. For example: I walked to {noun}."
                        onChange={(e) => setBody(e.target.value)}
                    />
                    {bodyErrors && <p style={{ color: "red" }}>{bodyErrors}</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        type="text"
                        className="mb-2"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </Form.Group>
                    <Button className="mx-4" onClick={handleCancel}>
                        Back
                    </Button>
                    <Button  type="submit">
                        Save
                    </Button>
            </Form>
        </div>
    )
}

export default MadlibForm;