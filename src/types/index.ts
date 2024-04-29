
export type UserType = {
    email:string, 
    first_name:string,
    last_name: string, 
    password:string,
    user_id:number, 
    token: string 
}

export type TokenType = {
    tokenExpiration: any
    token: string,
    token_expiration:number
}

export type UserFormDataType = {
    email:string, 
    first_name:string, 
    last_name:string,   
    password:string, 
    confirmPassword:string 
}


export type CategoryType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'


export type QuestionType = {
    answer:string, 
    author:UserType, 
    created_on:string, 
    id:number, 
    question: string 
}


export type QuestionFormDataType = {
    question:string, 
    answer:string 
}

export type EditQuestionData = {
    answer: string
}