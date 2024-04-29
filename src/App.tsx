import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AlertMessage from './components/AlertMessage';
import Navigation from './components/Navigation';
import Container from 'react-bootstrap/Container';
import Home from './views/Home';
import Register from './views/Register';
import Login from './views/Login';
import EditUser from './views/EditUser';
import MyQuestions from './views/MyQuestions';
import EditQuestions from './views/EditQuestions';
// import TakeQuiz from './views/TakeQuiz';
import { CategoryType, UserType } from './types';
import { getMe } from './lib/ApiWrapper';


export default function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('token') &&
        new Date(localStorage.getItem('tokenExp') || 0) > new Date()
        ? true
        : false
  );
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<CategoryType | undefined>(undefined);

  
  useEffect(() => {
    // Fetches the logged-in user's data from the server.
    async function getLoggedInUser() {
      if (isLoggedIn) {
        const token = localStorage.getItem('token') || '';
        const response = await getMe(token);
        if (response.data) {
          setLoggedInUser(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data)); // Sets the logged-in user in the state if the user is authenticated.
        } else {
          setIsLoggedIn(false); // Otherwise, sets the `isLoggedIn` state to false and logs the error.
          console.error(response.data);
        }
      }
    }
    getLoggedInUser();
  }, [isLoggedIn]);


  // Displays a flash message with the specified message and category.
  const flashMessage = (newMessage: string | undefined, newCategory: CategoryType | undefined) => {
    setMessage(newMessage);
    setCategory(newCategory);
  }

  // Sets the `isLoggedIn` state to true, indicating that the user is logged in.
  const logUserIn = () => {
    setIsLoggedIn(true);
  };

  const logUserOut = () => {
    setIsLoggedIn(false); // Logs the user out by setting the `isLoggedIn` state to false
    setLoggedInUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExp');
    localStorage.removeItem('currentUser'); // clearing the logged-in user data
    flashMessage('You have been logged out', 'dark'); // displaying a flash message.
  };


  return (
    <>
      {/* Renders the navigation bar */}
      <Navigation isLoggedIn={isLoggedIn} logUserOut={logUserOut} />
        <Container>
          {/* Displays the flash message if there is one */}
          {message && <AlertMessage message={message} category={category} flashMessage={flashMessage} />}
          <Routes>
            {/* Renders the home page */}
            <Route path='/' element={<Home isLoggedIn={isLoggedIn} currentUser={loggedInUser} flashMessage={flashMessage}/>} />

            {/* Renders the registration page */}
            <Route path='/register' element={<Register flashMessage={flashMessage} />} />

            {/* Renders the login page */}
            <Route path="/login" element={<Login flashMessage={flashMessage} logUserIn={logUserIn} />} />

            {/* Renders the edit user page */}
            <Route path="/user" element={<EditUser flashMessage={flashMessage} currentUser={loggedInUser} />} />
            
            {/* Renders the view my questions page */}
            <Route path="/my-questions" element={<MyQuestions isLoggedIn={isLoggedIn} flashMessage={flashMessage} currentUser={loggedInUser} />} />

            {/* Renders the edit my question page */}
            <Route path="/edit/questionId" element={<EditQuestions flashMessage={flashMessage} currentUser={loggedInUser} />} />

            {/* Renders the take quiz page */}
            {/* <Route path="/take-quiz" element={<TakeQuiz flashMessage={flashMessage} currentUser={loggedInUser} />} /> */}
          </Routes>
        </Container>
    </>
  );
}




