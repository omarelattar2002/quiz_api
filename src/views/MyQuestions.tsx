import { useEffect, useState } from "react";
import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";
import QuestionForm from "../components/QuestionForm";
import {QuestionType,CategoryType,QuestionFormDataType,UserType,} from "../types";
import { getMyQuestions, createQuestion } from "../lib/ApiWrapper";

type MyQuestionProps = {
  isLoggedIn: boolean; // Indicates whether a user is logged in or not
  currentUser: UserType | null; // Represents the currently logged in user
  flashMessage: (newMessage: string, newCategory: CategoryType) => void; // A function to display flash messages
};

export default function MyQuestion({isLoggedIn,currentUser,flashMessage,}: MyQuestionProps) {
  const [showForm, setShowForm] = useState(false); // State variable to control the visibility of a form
  const [myQuestions, setMyQuestions] = useState<QuestionType[]>([]); // State variable to store an array of questions
  const [fetchQuestionData, setFetchQuestionData] = useState(true); // State variable to trigger fetching of question data
    useEffect(() => {
    async function fetchData() {
      const response = await getMyQuestions(); // Fetch my questions from the API
        if (response.data) {
        setMyQuestions([response.data]); // Update the state variable with the fetched questions as an array
        }
    }
    fetchData(); // Call the fetchData function when the component mounts or when fetchQuestionData changes
}, [fetchQuestionData]);

  const [searchTerm, setSearchTerm] = useState(""); // State variable to store the search term

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    };

    const addNewQuestion = async (newQuestionData: QuestionFormDataType) => {
    const token = localStorage.getItem("token") || "";
    const response = await createQuestion(token, newQuestionData);
    if (response.error) {
        flashMessage(response.error, "danger");
    } else if (response.data) {
        flashMessage(`${response.data.question} has been created`, "success");
        setShowForm(false);
        setFetchQuestionData(!fetchQuestionData);
    }
    };

  // Render the welcome message and the list of questions
  // Render the welcome message and the list of questions
    return (
    <>
        {isLoggedIn && (
        <>
            <h1 className="text-center">{`Hello ${currentUser?.first_name} ${currentUser?.last_name}, these are your Questions!`}</h1>
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
            {Array.isArray(myQuestions) ? (
                myQuestions
                .filter((q) =>
                    q.question?.toLowerCase().includes(searchTerm.toLowerCase())).map((q) => (
                    <QuestionCard
                    key={q.id}
                    question={q}
                    currentUser={currentUser}
                    />
                ))
            ) : (
                <p>Error: Unable to load questions</p>
            )}
            </div>
        </>
        )}
    </>
    );
}
