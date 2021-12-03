import { API_URLS, HEADERS } from "../Utilities"

export async function loadExploreData(){
    const top5 = await getTop5();

    return {
        top5: top5
    }
}

// #TODO : mettre le vrai traitement de TOP5
async function getTop5(){
    return await fetch(API_URLS.artisteUrl, { HEADERS })
        .then(res => res.json())
        .then(data => data,
        (error) => {
            console.log("Erreur", error)
        })
}