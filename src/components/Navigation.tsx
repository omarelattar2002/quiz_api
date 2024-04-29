import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';


// Props for the Navigation component.
type NavigationProps = {
    isLoggedIn: boolean; // Indicates whether the user is logged in or not
    logUserOut: () => void; // Function to log the user out
}

export default function Navigation({ isLoggedIn, logUserOut }: NavigationProps): JSX.Element {

    const [backgroundTheme, setBackgroundTheme] = useState('dark'); // State to track the background theme of the navigation bar

    // Return the navigation bar
    return (
        <Navbar expand='lg' data-bs-theme={backgroundTheme} bg={backgroundTheme}>
            <Container fluid>
                <Navbar.Brand as={Link} to='/'>Quiz App</Navbar.Brand> {/* Brand link to the home page */}
                <Navbar.Toggle aria-controls='nav-collapse' />
                <Navbar.Collapse id='nav-collapse'>
                    <Nav className='me-auto'>
                        {isLoggedIn ? ( // If the user is logged in
                            <>
                                <Nav.Link href='/'>Create Question</Nav.Link> {/* Link to create a new question */}
                                <Nav.Link as={Link} to='/my-questions'>My Questions</Nav.Link> {/* Link to the user's questions */}
                                <Nav.Link as={Link} to='/user'>Edit User</Nav.Link> {/* Link to edit the user's profile */}
                                <Nav.Link as={Link} to='/' onClick={()=> logUserOut()} href='/'>Log Out</Nav.Link> {/* Link to log out the user */}
                            </>
                        ) : ( // If the user is not logged in
                            <>
                                <Nav.Link as={Link} to='/register'>Register Account</Nav.Link> {/* Link to registration page */}
                                <Nav.Link as={Link} to='/login'>Log In</Nav.Link> {/* Link to log in page */}
                            </>
                        )}
                    </Nav>
                    <Nav>
                        <Button onClick={() => setBackgroundTheme(backgroundTheme === 'dark' ? 'light' : 'dark')}>Change Background</Button> {/* Button to change the background theme */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}