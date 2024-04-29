import axios from 'axios';
import { QuestionType, UserType, UserFormDataType, TokenType, QuestionFormDataType, EditQuestionData } from '../types';



const baseURL:string  = 'https://cae-bookstore.herokuapp.com/';

const userEndpoint = '/user';
const questionEndpoint = '/question';
const loginEndpoint = '/login';


const apiClientNoAuth = () => axios.create({
    baseURL: baseURL
}); // axios instance with the base URL with no auth needed

// Create an API client with basic authentication
const apiClientBasicAuth = (email:string, password:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Basic ' + btoa(email + ':' + password)
    }
})

// Create an API client with token-based authentication
const apiClientTokenAuth = (token:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Bearer ' + token
    }
})

type APIResponse<T> = { // generic type for the API response
    data?: T,
    error?: string
} 

// function to register a new user
async function register(newUserData:UserFormDataType):Promise<APIResponse<UserType>> {
    let data;
    let error;
    try {
        const response = await apiClientNoAuth().post(userEndpoint, newUserData); // send a post request to the register endpoint with the new user data
        data = response.data; // store the response data in the 'data' variable
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data; // if axios error, store the response data in the 'error' variable
        } else {
            error = 'Something went wrong'; // If the error is not axios, set generic error message
        }
    }
    return { data, error }; // return the data and error
}

// Function to login with email and password
async function login(email:string, password:string): Promise<APIResponse<TokenType>> {
    let data;
    let error;
    try{
        // Make a GET request to the token endpoint using the API client with basic authentication
        const response = await apiClientBasicAuth(email, password).get(loginEndpoint)
        data = response.data.token
    } catch(err){
        // Handle any errors that occur during the request
        if (axios.isAxiosError(err)){
            error = err.response?.data
        } else {
            error = 'Something went wrong'
        }
    }
    // Return the API response object
    return { data, error }
}

// function to update the user
async function updateUser(token:string, updatedUserData:UserFormDataType): Promise<APIResponse<UserType>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).put(userEndpoint, updatedUserData); // send a put request to the user endpoint with the token and updated user data
        data = response.data; // store the response data in the 'data' variable
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data; // if axios error, store the response data in the 'error' variable
        } else {
            error = 'Something went wrong'; // If the error is not axios, set generic error message
        }
    }
    return { data, error }; // return the data and error
}

//function to delete the user
async function deleteUser(token:string): Promise<APIResponse<string>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).delete(userEndpoint); // send a delete request to the user endpoint with the token
        data = response.data.success; // store the success status in the 'data' variable
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data; // if axios error, store the response data in the 'error' variable
        } else {
            error = 'Something went wrong'; // If the error is not axios, set generic error message
        }
    }
    return { data, error }; // return the data and error
}

async function getMe(token:string): Promise<APIResponse<UserType>> {
    let data; // Variable to store the response data
    let error; // Variable to store any error message
    try {
        const response = await apiClientTokenAuth(token).get(userEndpoint + '/me'); // Send a GET request to retrieve user data
        data = response.data; // Store the response data in the 'data' variable
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data; // If the error is an Axios error, extract the error message from the response
        } else {
            error = 'Something went wrong'; // If it's not an Axios error, set a generic error message
        }
    }
    return { data, error }; // Return an object containing the data and error variables
}


async function getAllQuestions(): Promise<APIResponse<QuestionType[]>> {
    let data;
    let error;
    try { 
        const response = await apiClientNoAuth().get(questionEndpoint + '/all'); // send a get request to the question endpoint with no auth needed
        data = response.data['questions']; // store the response data in th 'data' variable
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data; // if axios error, store the response data in the 'error' variable
        } else {
            error = 'Something went wrong'; // If the error is not axios, set generic error message
        }
    }
    return { data, error }; // return the data and error
}

async function getMyQuestions(): Promise<APIResponse<QuestionType>> {
    let data; // Variable to store the response data
    let error; // Variable to store any error message

    try {
        const response = await apiClientNoAuth().get(questionEndpoint);
        data = response.data['questions']; // Store the response data in the 'data' variable
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data || `Post with ID ${data.question} does not exist`; // If the error is an Axios error, extract the error message from the response data or use a default error message
        } else {
            error = 'Something went wrong'; // If the error is not an Axios error, set a generic error message
        }
    }

    return { data, error }; // Return an object containing the data and error variables
}

async function createQuestion(token: string, questionData: QuestionFormDataType): Promise<APIResponse<QuestionType>> {
    let data; // Variable to store the response data
    let error; // Variable to store any error message

    try {
        const response = await apiClientTokenAuth(token).post(questionEndpoint, questionData); // Send a POST request to the API using the apiClientTokenAuth function and the provided token and questionData
        data = response.data; // Store the response data in the 'data' variable
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data; // If the error is an Axios error, store the error message from the response data in the 'error' variable
        } else {
            error = 'Something went wrong'; // If the error is not an Axios error, set a generic error message
        }
    }

    return { data, error }; // Return an object containing the data and error variables
}

async function editQuestionById(questionId:string|number, token:string, editedQuestionData:EditQuestionData): Promise<APIResponse<QuestionType>> {
    let data; // Variable to store the response data
    let error; // Variable to store any error message

    try {
        const response = await apiClientTokenAuth(token).put(questionEndpoint + '/' + questionId, editedQuestionData);
        data = response.data; // Store the response data in the 'data' variable
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data || `Question with ID ${questionId} does not exist`; // If the error is an Axios error, extract the error message from the response data or use a default error message
        } else {
            error = 'Something went wrong'; // If the error is not an Axios error, set a generic error message
        }
    }

    return { data, error }; // Return an object containing the data and error variables
}

async function deleteQuestionById(questionId:string|number, token:string): Promise<APIResponse<string>> {
    let data; // Variable to store the response data
    let error; // Variable to store any error message

    try {
        const response = await apiClientTokenAuth(token).delete(questionEndpoint + '/' + questionId);
        data = response.data.success; // Store the success status in the 'data' variable
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data || `Question with ID ${questionId} does not exist`; // If the error is an Axios error, extract the error message from the response data or use a default error message
        } else {
            error = 'Something went wrong'; // If the error is not an Axios error, set a generic error message
        }
    }

    return { data, error }; // Return an object containing the data and error variables
}


export { 
    getAllQuestions,
    register,
    login,
    deleteUser,
    updateUser,
    getMe,
    createQuestion,
    getMyQuestions,
    editQuestionById,
    deleteQuestionById
}; // export the function to be used in other files