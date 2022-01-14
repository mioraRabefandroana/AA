import { API_URLS, ERROR_MSG, getHeaders } from "../Utilities"

export async function loadExploreData({user}){
    const top5 = await getTop5();



    return {
        top5: top5
    }
}

/**
 * get explore publications (on explore page) based on user (subscribed)
 * @param {*} param0 
 */
export async function getExplorePublications({user})
{
    let url = (user) ? API_URLS.explorePublicationsByUser(user.id) : API_URLS.explorePublications;

    const requestOptions = {
        headers: getHeaders()
    };

    try{
        const res = await fetch(url, requestOptions)
        .then(response => {
            if(response.ok)
                return response.json();
            throw new Error(ERROR_MSG.PUBLICATIONS_FETCH_FAILED)
        })
        .then(data => {
            return data;
            },
            (error)=>{
                throw new Error(ERROR_MSG.PUBLICATIONS_FETCH_FAILED);
            })

        return res;
    }
    catch(error)
    {
        console.log("fetching publication error :", error);
        return [];
    }
    
}

async function getPublications({user}){
    // const url = (user) ? 
}


// #TODO : mettre le vrai traitement de TOP5
async function getTop5(){
    const HEADERS = getHeaders();
    return await fetch(API_URLS.artisteUrl, { HEADERS })
        .then(res => res.json())
        .then(data => data,
        (error) => {
            console.log("Erreur TOP5", error)
        })
}