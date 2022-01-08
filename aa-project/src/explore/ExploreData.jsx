import { API_URLS, getHeaders } from "../Utilities"

export async function loadExploreData({user}){
    const top5 = await getTop5();



    return {
        top5: top5
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