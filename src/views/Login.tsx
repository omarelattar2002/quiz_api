import React, { useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { CategoryType, UserFormDataType } from '../types';
import { login } from '../lib/ApiWrapper';
import { useNavigate } from 'react-router-dom';


type LoginProps = {
    flashMessage: (newMessage: string | undefined, newCategory: CategoryType | undefined) => void,
    logUserIn: () => void
}

export default function Login({ flashMessage, logUserIn }: LoginProps) {
    const navigate = useNavigate();

    const [userFormData, setUserFormData] = useState<Partial<UserFormDataType>>(
        {
            email: '',
            password: '',
        }
    )

    const [seePassword, setSeePassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const response = await login(userFormData.email!, userFormData.password!)
    
        if (response.error) {
            flashMessage(response.error, 'danger')
        } else {
            const token = response.data!.token;
            const tokenExp = response.data!.tokenExpiration;
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExp', tokenExp);
            logUserIn();
            flashMessage(response.data?.token, 'success');
            navigate('/')
        }
    }

    return (
        <>
            <h1 className="text-center">Log In Here</h1>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label htmlFor='email'>Email</Form.Label>
                        <Form.Control id='email' name='email' placeholder='Enter Email' value={userFormData.email} onChange={handleInputChange} />

                        <Form.Label htmlFor='password'>Password</Form.Label>
                        <InputGroup>
                            <Form.Control id='password' name='password' type={seePassword ? 'text' : 'password'} placeholder='Enter Password' value={userFormData.password} onChange={handleInputChange} />
                            <InputGroup.Text onClick={() => setSeePassword(!seePassword)}><i className={seePassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></InputGroup.Text>
                        </InputGroup>

                        <Button type='submit' variant='outline-primary' className='w-100 mt-3'>Log In</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}