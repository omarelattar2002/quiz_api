import Alert from 'react-bootstrap/Alert';
import { CategoryType } from '../types';


// Props for the AlertMessage component.
type AlertMessageProps = {
    message: string | undefined, // The message to display
    category: CategoryType | undefined, // The category of the message
    flashMessage: (newMessage: string | undefined, newCategory: CategoryType | undefined) => void // Function to clear the message
}

export default function AlertMessage({ message, category, flashMessage }: AlertMessageProps) {
    // This is a functional component named AlertMessage that accepts a prop: message, category, and flashMessage


    // Return the Alert component with the message and category
    return (
        <Alert className='mt-3' variant={category} dismissible onClose={() => flashMessage(undefined, undefined)}>
            {message}
        </Alert>
    )
}