import { getHeaders, API_URLS, ERROR_MSG, setCookie, getCookie, removeToken } from './Utilities';

/**
 * login user with username and password
 * @param {*} username 
 * @param {*} password 
 * @returns token
 */
export async function login(username, password){
    const requestOptions = {
        method: 'POST',
        headers: getHeaders(),
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


export async function logout(){
    const requestOptions = {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({})
    };
    
    const res = await fetch(API_URLS.apiLogoutUrl, requestOptions)
        .then(response => {
            return response.json();
        })
        .then(data => {
            
        },
        (error)=>{
            
        })
        
    return res;
}


/**
 * get authentified user data
 * @param {*} username 
 * @returns 
 */
export async function getAuthentifiedUser(username){
    console.log(getHeaders());
    const requestOptions = {
        headers: getHeaders()
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
        headers: getHeaders(),
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
                throw new Error(ERROR_MSG.USER_REGISTER_FAILED);
            })
        
    return res;
}


export async function updateUser(user){
    console.log("updateUser")
    const requestOptions = {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(user)
    };

    const res = await fetch(API_URLS.updateUser(user.id), requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                throw new Error(ERROR_MSG.USER_UPDATE_FAILED);
            })
        
    return res;
}


/**
 * save authetification token into the headers
 * @param {*} token 
 */
function saveAuthentificationToken(token){
    setCookie("token", token);
}


export async function getAuthentifiedUserFromSession(){
    const token = getCookie("token");
    if(!token)
        return [];

    console.log("TOKEN", token);
    console.log("getHeaders()", getHeaders());
    const requestOptions = {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({token: token})
    };

    // console.log("URL ===>", API_URLS.userByToken);
    // debugger;
    // return; //DEBUG

    const res = await fetch(API_URLS.userByToken, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                return [];        
            })    
    return res;
}


export async function uploadCoverPicture(pictureFile, userId){

    let formData = new FormData();            
    formData.append("coverPicture", pictureFile);
    formData.append("userId", userId)

    const headers = getHeaders();
    delete headers["Content-Type"];

    const requestOptions = {
        method: 'POST',
        headers: {},
        body: formData
    };

    return await uploadImage(API_URLS.coverPictureUpload, requestOptions);
}

export async function uploadProfilePicture(pictureFile, userId){

    let formData = new FormData();            
    formData.append("profilePicture", pictureFile);
    formData.append("userId", userId)

    const headers = getHeaders();
    delete headers["Content-Type"];

    const requestOptions = {
        method: 'POST',
        headers: {},
        body: formData
    };

    return await uploadImage(API_URLS.profilePictureUpload, requestOptions);
}

export async function uploadImage(url, requestOptions){
        
        try{
            const res = await fetch(url, requestOptions)
                .then(response => {
                    if(response.ok)
                        return response.json();
                    throw new Error(ERROR_MSG.UPLOAD_FAILED)
                })
                .then(data => {
                        return data;
                    },
                    (error)=>{
                        throw new Error(ERROR_MSG.UPLOAD_FAILED);
                })

            console.log("res ==>", res)
            return [res.filename, res.message];
        }
        catch(error){
            return [null, error.message]
        }
            
}