import { getHeaders, API_URLS, ERROR_MSG, setCookie, getCookie, removeToken } from './Utilities';


export function getUserFullName(user){
    return user.firstName + " " + user.name;
}

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


export function isAuthenticated(user){
    return !!(user && user["id"]);
}


/**
 * get authentified user data
 * @param {*} username 
 * @returns 
 */
export async function getAuthentifiedUser(username){
    // console.log(getHeaders());
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
                throw new Error(ERROR_MSG.ARTIST_UPDATE_FAILED);
            })
        
    return res;
}

export async function updateArtist(artist){
    console.log("updateArtist")
    const requestOptions = {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(artist)
    };

    const res = await fetch(API_URLS.updateArtist(artist.id), requestOptions)
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
        return null;

    console.log("TOKEN", token);
    const requestOptions = {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({token: token})
    };

    try{
        const [user] = await fetch(API_URLS.userByToken, requestOptions)
        .then(response => {
                if(response.ok)
                    return response.json();
        })
        .then(data => {
                return data;
                },
                (error)=>{
                    return null;        
        })    

        if(user)
        {
            user.artist = await getArtistByUser(user)
            user.fan = await getFanByUser(user)
            return user
        }
        return null;
    }
    catch(error){
        console.log("error auth session => ", error)
        return null;
    }
}

export async function getArtistByUser(user){

    const requestOptions = {
        method: 'GET',
        headers: getHeaders()
    };

    const [artist] = await fetch(API_URLS.artistByUserId(user.id), requestOptions)
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
    return artist;
}

export async function getFanByUser(user){

    const requestOptions = {
        method: 'GET',
        headers: getHeaders()
    };

    const [fan] = await fetch(API_URLS.fanByUserId(user.id), requestOptions)
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
    console.log("FAN",API_URLS.fanByUserId(user.id), fan)
    return fan;
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

            // console.log("res ==>", res)
            return [res.filename, res.message];
        }
        catch(error){
            return [null, error.message]
        }
            
}




/**
 * subscribe to a publisher (artist)
 * @param {*} user 
 * @param {*} publisher 
 * @returns 
 */
export async function subscribeToPublisher(user, publisher){
    try{
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                subscriber: user.id,
                subscribed: publisher.id
            })
        };

        const res = await fetch(API_URLS.subscribe, requestOptions)
            .then(response => {
                if(response.ok)
                    return response.json();
            })
            .then(data => {
                return data;
                },
                (error)=>{
                    // return false;
                    throw Error(error)
                })
        return res;
    }
    catch(error){
        console.log("error SUBSCRIBE : ", error )
        return false;
    }
}
/**
 * unsubscribe from publisher
 * @param {*} user 
 * @param {*} publisher 
 */
export async function unSubscribeFromPublisher(user, publisher){
    try{
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                subscriber: user.id,
                subscribed: publisher.id
            })
        };

        const res = await fetch(API_URLS.unSubscribe, requestOptions)
            .then(response => {
                if(response.ok)
                    return response.json();
            })
            .then(data => {
                return data;
                },
                (error)=>{
                    // return false;
                    throw Error(error)
                })
        return res;
    }
    catch(error){
        console.log("error UNSUBSCRIBE : ", error )
        return false;
    }
}

export function isUserSubscribed(user, publisher){
    try{
        let res = ( publisher.subscribers.indexOf(user.id) != -1 );
        return res;
    }
    catch(error){ 
        console.log("ERROR isUserSubscribed ", error)
        return false; 
    }
}