import { HEADERS, API_URLS, ERROR_MSG } from './Utilities';

/**
 * login user with username and password
 * @param {*} username 
 * @param {*} password 
 * @returns token
 */
export async function login(username, password){
    const requestOptions = {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({username,password})
    };
    
    const res = await fetch(API_URLS.apiLoginUrl, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
            throw new Error(ERROR_MSG.AUTH_FAILED)
        })
        .then(data => {
            saveAuthentificationToken(data.key)
            return data.key;
            },
            (error)=>{
                throw new Error(ERROR_MSG.AUTH_FAILED);
            })
        
    return res;
}

/**
 * get authentified user data
 * @param {*} username 
 * @returns 
 */
export async function getAuthentifiedUser(username){
    const requestOptions = {
        headers: HEADERS
    };

    const res = await fetch(API_URLS.userByusername(username), requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
            throw new Error(ERROR_MSG.USER_NOT_FOUND)
        })
        .then(data => {
            return data[0];
            },
            (error)=>{
                throw new Error(ERROR_MSG.USER_NOT_FOUND);
            })
        
    return res;
}

export let CURRENT_USER = null;
export function saveCurrentUser(user){
    CURRENT_USER = user;
}
export function removeCurrentUser(){
    CURRENT_USER = null;
}

/**
 * register new user
 * @param {*} user 
 * @returns 
 */
export async function registerUser(user){
    const requestOptions = {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(user)
    };

    const res = await fetch(API_URLS.userRegister, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                console.log("/!\\\n", error.message)
                throw new Error(ERROR_MSG.USER_REGISTER_FAILED);
            })
        
    return res;

}


/**
 * save authetification token into the headers
 * @param {*} token 
 */
function saveAuthentificationToken(token){
    console.log("token :) ",token)
    HEADERS.Authorization = `token ${token}`;
}

  