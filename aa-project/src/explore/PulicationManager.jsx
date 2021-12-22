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

    const res = await fetch(API_URLS.newPublication, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                return null
                // throw new Error(ERROR_MSG.NEW_PUBLICATION_FAILED);
            })
    return res;
}


export async function getUserPublications(user){
    const requestOptions = {
        method: 'GET',
        headers: getHeaders()//,
        // body: JSON.stringify()
    };
debugger;
    const res = await fetch(API_URLS.userPublications(user.id), requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
            return data;
            },
            (error)=>{
                console.log("error =>", error);
                return [];
                // throw new Error(ERROR_MSG.ARTIST_UPDATE_FAILED);
            })
        
    return res;


    // TODO : récupérer les vraies publications pour l'utilisateur
    let publications = Array.from(Array(10).keys())
    return publications.map(i => "publication "+i);
}
