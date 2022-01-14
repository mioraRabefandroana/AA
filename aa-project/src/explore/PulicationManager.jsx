import { isAuthenticated } from "../UserManager";
import { API_URLS, ERROR_MSG, getHeaders } from "../Utilities";

export async function createNewPublication(publication, userId){    
    let formData = new FormData();  
    formData.append("userId", userId);
    for(let name in publication)          
        formData.append(name, publication[name]);

    const headers = getHeaders();
    delete headers["Content-Type"];

    const requestOptions = {
        method: 'POST',
        headers: {},
        body: formData
    };

    const [res] = await fetch(API_URLS.newPublication, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                return [null]
            })
    return {
        publication: res
    };
}

/**
 * get user's publications
 * @param {*} user 
 * @returns 
 */
export async function getUserPublications(user){
    const requestOptions = {
        method: 'GET',
        headers: getHeaders()
    };

    const res = await fetch(API_URLS.userPublications(user.id), requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                console.log("error getUserPublications =>", error);
                return [];
                // throw new Error(ERROR_MSG.ARTIST_UPDATE_FAILED);
            })
        
    return res;
}

/**
 * like a publication
 * @param {*} publication 
 * @param {*} user 
 * @returns 
 */
export async function likePublication(publication, user){
    try{
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                publication: publication.id,
                user: user.id
            })
        };

        const [res] = await fetch(API_URLS.likePublication, requestOptions)
            .then(response => {
                if(response.ok)
                    return response.json();
            })
            .then(data => {
                return data;
                },
                (error)=>{
                    return [null];
                })
        return res;
    }
    catch(error){
        console.log("error LIKE : ", error )
        return null;
    }
}

/**
 * unlike a publication
 * @param {*} publication 
 * @param {*} user 
 * @returns 
 */
export async function unlikePublication(publication, user){
    try{
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                publication: publication.id,
                user: user.id
            })
        };

        const [res] = await fetch(API_URLS.unlikePublication, requestOptions)
            .then(response => {
                if(response.ok)
                    return response.json();
            })
            .then(data => {
                return data;
                },
                (error)=>{
                    return [null];
                })
        return res;
    }
    catch(error){
        console.log("error UNLIKE : ", error )
        return null;
    }
}

/**
 * does the user liked the given publication ?
 */
export function isPublicationLikedByUser(publication, user){
    // debugger;
    if(!isAuthenticated(user))
        return false;
    // debugger;
    for(let like of publication.likes)
    {
        if(like.user.id == user.id)
        {
            return true;
        }
    }
    return false;
}


export async function commentPublication(publication, user, text){
    try{
        const requestOptions = {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                publication: publication.id,
                user: user.id,
                text
            })
        };
        const [res] = await fetch(API_URLS.commentPublication, requestOptions)
            .then(response => {
                if(response.ok)
                    return response.json();
            })
            .then(data => {
                return data;
                },
                (error)=>{
                    return [null];
                })
        return res;
    }
    catch(error){
        console.log("error COMMENT : ", error )
        return null;
    }
}
