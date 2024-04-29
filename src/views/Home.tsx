import { useEffect, useState } from "react";
import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";
import QuestionForm from "../components/QuestionForm";
import {QuestionType,CategoryType,QuestionFormDataType,UserType,} from "../types";
import { getAllQuestions, createQuestion } from "../lib/ApiWrapper";

type HomeProps = {isLoggedIn: boolean; currentUser: UserType | null; flashMessage: (newMessage: string, newCategory: CategoryType) => void; };

export default function Home({isLoggedIn,currentUser,flashMessage,}: HomeProps) {
    const [showForm, setShowForm] = useState(false); 
    const [questions, setQuestions] = useState<QuestionType[]>([]); 
    const [fetchQuestionData, setFetchQuestionData] = useState(true); 

    useEffect(() => {
    async function fetchData() {
        const response = await getAllQuestions(); 
        if (response.data) {
        const questions = response.data; 
        setQuestions(questions); 
        }
    }
    fetchData(); 
    }, [fetchQuestionData]);

    const [searchTerm, setSearchTerm] = useState(""); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    };

    const addNewQuestion = async (newQuestionData: QuestionFormDataType) => {
        const token = localStorage.getItem("token") || "" as string;
        const response = await createQuestion(token, newQuestionData);
    if (response.error) {
        flashMessage(response.error, "danger");
    } else if (response.data) {
        flashMessage(`${response.data.question} has been created`, "success");
        setShowForm(false);
        setFetchQuestionData(!fetchQuestionData);
    }
    };


    return (
    <>
        <h1 className="text-center">
        {isLoggedIn && currentUser
            ? `Hello ${currentUser?.first_name} ${currentUser?.last_name}`: "Welcome to the Questions App"}
        </h1>
        <Row>
        <Col xs={12} md={6}>
            <Form.Control
            value={searchTerm}
            placeholder="Search Questions"
            onChange={handleInputChange}
            />
        </Col>
        {isLoggedIn && (
            <Col>
            <Button
                className="w-100"
                variant="success"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Hide Form" : "Add Question"}
            </Button>
            </Col>
        )}
        </Row>
        <div>
        {showForm && <QuestionForm addNewQuestion={addNewQuestion} />}
        {Array.isArray(questions) ? (
            questions.filter((q) =>
                q.question?.toLowerCase().includes(searchTerm.toLowerCase())).map((q) => (
                <QuestionCard key={q.id} question={q} currentUser={currentUser} />
            ))
        ) : (
            <p>Error: Unable to load questions</p>
        )}
        </div>
    </>
    );
}
