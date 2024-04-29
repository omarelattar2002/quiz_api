import React, { useState } from 'react';
import { Button , Card, Form } from 'react-bootstrap';
import { QuestionFormDataType } from '../types';

type QuestionFormProps = {
    addNewQuestion: (data: QuestionFormDataType) => void
}

export default function QuestionForm({ addNewQuestion}: QuestionFormProps) {
    const [newQuestion, setNewQuestion] = useState<QuestionFormDataType>({
        question: '',
        answer: ''
    });

   
    // Handles the input change event.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion({
            ...newQuestion,
            [event.target.name]: event.target.value
        });
    }


    // Handles the form submit event.    
    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        addNewQuestion(newQuestion)
    }

    return (
        <Card className='my-3'>
            <Card.Body>
                <h3 className="text-center">Create New Question</h3>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Label>Question</Form.Label>
                    <Form.Control name='question' placeholder='Enter New Question' value={newQuestion.question} onChange={handleInputChange} />
                    <Form.Label>Answer</Form.Label>
                    <Form.Control name='answer' placeholder='Enter Answer' value={newQuestion.answer} onChange={handleInputChange} />
                    <Button className='mt-3 w-100' variant='success' type='submit'>Create Question</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}