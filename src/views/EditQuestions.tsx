import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteQuestionById, editQuestionById, getMyQuestions } from '../lib/ApiWrapper';
import { Button, Modal, Card, Form } from 'react-bootstrap';
import { CategoryType, EditQuestionData, UserType } from '../types';


// This code defines the type for the props of the EditQuestion component.
// The EditQuestionProps type is an object that contains two properties:
type EditQuestionProps = {
    //   This function is used to display flash messages in the application.
    flashMessage: (message:string, category:CategoryType) => void  // - flashMessage: a function that takes a message (string) and a category (CategoryType) as parameters and returns void.
    currentUser: UserType|null // - currentUser: a variable of type UserType|null, which represents the currently logged-in user.
}



// This component is responsible for rendering a form to edit a question.
// It receives the following props: flashMessage (a function to display flash messages), and currentUser (the currently logged-in user).
export default function EditQuestion({ flashMessage, currentUser }: EditQuestionProps) {
    // The useParams hook is used to retrieve the questionId from the URL parameters.
    const { questionId } = useParams();
    // The useNavigate hook is used to programmatically navigate to different routes.
    const navigate = useNavigate();

    // The questionToEditData state variable is used to store the data of the question being edited.
    // It is initialized with an empty title and body.
    const [questionToEditData, setQuestionToEditData] = useState<EditQuestionData>({answer: ''});
    // The showModal state variable is used to control the visibility of the delete confirmation modal.
    const [showModal, setShowModal] = useState(false);

    // The openModal function is called to show the delete confirmation modal.
    const openModal = () => setShowModal(true);
    // The closeModal function is called to hide the delete confirmation modal.
    const closeModal = () => setShowModal(false);
    
    // The useEffect hook is used to fetch the question data when the component mounts.
    useEffect(() => {
        // The getQuestion function is an async function that fetches the question data from the server.
        async function getQuestion() {
            // The getQuestionById function is called with the questionId to retrieve the question data.
            const response = await getMyQuestions();
            if (response.data) {
                // If the response contains data, it means the questions exists.
                const question = response.data;
                // The currentUser is retrieved from the local storage.
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                // If the current user is not the author of the question, display an error message and navigate to the home page.
                if (currentUser?.id !== question.author.user_id) {
                    flashMessage('You do not have permission to edit this question', 'danger');
                    navigate('/');
                } else {
                    // If the current user is the author of the question, set the questionToEditData state with the question data.
                    setQuestionToEditData({answer: question.answer});
                }
            } else if (response.error) {
                // If there is an error in the response, display the error message and navigate to the home page.
                flashMessage(response.error, 'danger');
                navigate('/');
            } else {
                // If the response does not contain data or error, display a generic error message and navigate to the home page.
                flashMessage("Something went wrong", 'warning');
                navigate('/');
            }
        }

        // Call the getQuestion function when the component mounts or when the questionId or currentUser changes.
        getQuestion();
    }, [questionId, currentUser, flashMessage, navigate]);

    // The handleInputChange function is called when the input fields in the form are changed.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the questionToEditData state with the new input values.
        setQuestionToEditData({...questionToEditData, [event.target.name]: event.target.value});
    }

    // The handleFormSubmit function is called when the form is submitted.
    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Retrieve the token from the local storage.
        const token = localStorage.getItem('token') || '';
        // Call the editQuestionById function to update the question with the new data.
        const response = await editQuestionById(questionId!, token, questionToEditData);
        if (response.error) {
            // If there is an error in the response, display the error message.
            flashMessage(response.error, 'danger');
        } else {
            // If the question is successfully updated, display a success message and navigate to the home page.
            flashMessage(`The answer to ${response.data?.question} has been updated to ${response.data?.answer}`, 'success');
            navigate('/');
        }
    }

    // The handleDeleteClick function is called when the delete button is clicked.
    const handleDeleteClick = async () => {
        // Retrieve the token from the local storage.
        const token = localStorage.getItem('token') || '';
        // Call the deleteQuestionById function to delete the question.
        const response = await deleteQuestionById(questionId!, token);
        if (response.error) {
            // If there is an error in the response, display the error message.
            flashMessage(response.error, 'danger');
        } else {
            // If the question is successfully deleted, display a confirmation message and navigate to the home page.
            flashMessage(response.data!, 'primary');
            navigate('/');
        }
    }

    // The component renders a form to edit the question.
    return (
        <>
            <Card className='my-3'>
                <Card.Body>
                    <h3 className="text-center">Edit Question</h3>
                    <Form onSubmit={handleFormSubmit}>
                        
                        <Form.Label>Question Answer</Form.Label>
                        <Form.Control as='textarea' name='answer' placeholder='Edit Question Answer' value={questionToEditData.answer} onChange={handleInputChange} />
                        <Button className='mt-3 w-50' variant='info' type='submit'>Edit Question</Button>
                        <Button className='mt-3 w-50' variant='danger' onClick={openModal}>Delete Question</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={closeModal} className='text-dark'>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {questionToEditData.answer}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {questionToEditData.answer}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                    <Button variant='danger' onClick={handleDeleteClick}>Delete Question</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}