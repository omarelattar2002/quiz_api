import { useState } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { CategoryType, UserFormDataType } from '../types';
import { register } from '../lib/ApiWrapper';
import { useNavigate } from 'react-router-dom';


// Define the type for the SignUp component props
type RegistrationProps = {
    flashMessage: (newMessage: string | undefined, newCategory: CategoryType | undefined) => void
}

export default function Register({ flashMessage }: RegistrationProps) {
    const navigate = useNavigate();

    const [userFormData, setUserFormData] = useState<UserFormDataType>(
        {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    )

    const [seePassword, setSeePassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({...userFormData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(userFormData);

        const response = await register(userFormData);
        if (response.error){
            flashMessage(response.error, 'danger');
        } else {
            const newUser = response.data!
            flashMessage(`Congrats user ${newUser.first_name} ${newUser.last_name} has been registered!`, 'success')
            navigate('/');
        }
    }

    
    const disableSubmit = !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\!\?])(?=.*[a-zA-Z]).{8,16}$/.test(userFormData.password) || userFormData.password !== userFormData.confirmPassword

    return (
        <>
            <h1 className="text-center">Register Today!</h1>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label htmlFor='first_name'>First Name</Form.Label>
                        <Form.Control id='first_name' name='first_name' placeholder='Enter First Name' value={userFormData.first_name} onChange={handleInputChange}/>

                        <Form.Label htmlFor='last_name'>Last Name</Form.Label>
                        <Form.Control id='last_name' name='last_name' placeholder='Enter Last Name' value={userFormData.last_name} onChange={handleInputChange}/>

                        <Form.Label htmlFor='email'>Email</Form.Label>
                        <Form.Control id='email' name='email' type='email' placeholder='Enter Email' value={userFormData.email} onChange={handleInputChange}/>

                        <Form.Label htmlFor='password'>Password</Form.Label>
                        <InputGroup>
                            <Form.Control id='password' name='password' type={seePassword ? 'text' : 'password'} placeholder='Enter Password' value={userFormData.password} onChange={handleInputChange}/>
                            <InputGroup.Text onClick={() => setSeePassword(!seePassword)}><i className={seePassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></InputGroup.Text>
                        </InputGroup>

                        <Form.Label htmlFor='confirmPassword'>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control id='confirmPassword' name='confirmPassword'  type={seePassword ? 'text' : 'password'} placeholder='Confirm Password' value={userFormData.confirmPassword} onChange={handleInputChange}/>
                            <InputGroup.Text onClick={() => setSeePassword(!seePassword)}><i className={seePassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></InputGroup.Text>
                        </InputGroup>

                        <Button type='submit' variant='outline-primary' className='w-100 mt-3' disabled={disableSubmit}>Create New User</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}