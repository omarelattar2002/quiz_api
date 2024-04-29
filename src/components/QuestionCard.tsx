import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuestionType, UserType } from '../types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// Define the type for the props that the QuestionCard component accepts
type QuestionCardProps = {
    question: QuestionType, // The post object containing information about the post
    currentUser: UserType|null, // The currently logged-in user or null if no user is logged in
}

export default function QuestionCard({ question, currentUser }: QuestionCardProps) {
    const [showAnswer, setShowAnswer] = useState(false); // State to control displaying the answer
  
    const handleViewAnswers = () => {
      setShowAnswer(true); // Update state to show the answer when the button is clicked
    };
  
    return (
        <Card className='my-3 bg-custom' text='white'>
            {/* This is the header section of the card */}
            <Card.Header>{question.created_on}</Card.Header>
            <Card.Body>
                <Card.Text>{question.question}</Card.Text>
  
                {!showAnswer && (
                    <Button variant='primary' onClick={handleViewAnswers}>
                    View Answers
                    </Button>
                )}
  
                {showAnswer && <Card.Text>{question.answer}</Card.Text>}
                {/* This is a conditional rendering of a button */}
                {/* It checks if the author's id matches the current user's id */}
                {/* If they match, it renders a Link component with a button to edit the question */}
                {question.author.user_id === currentUser?.user_id && <Link to={`/edit/${question.id}`}><Button variant='primary'>Edit Question</Button></Link>}
            </Card.Body>
        </Card>
    )
}