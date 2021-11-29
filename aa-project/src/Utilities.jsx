
import logo from './logo.svg';
import uniqid from 'uniqid';


export const PRODUCT_TYPE = {
    film: "film",
    video: "video",
    music: "music"
  }
  
// #TODO : mettre les vraies icône pour chaque type de produit
export const PRODUCT_TYPE_ICON = {
  film: logo,
  video: logo,
  music: logo
}

export const PUBLICATION_CONTENT_TYPE = {
  image: "image",
  video: "video"
}

// #TODO : mettre les vrais icônes pour les badges
// #TODO : Ajouter tous les badges
export const BADGE = {
  "star": {
    name: "star",
    icon: logo
  },
  "superstar": {
    name: "superstar",
    icon: logo
  }
}

export const API_URL_ORIGIN = "http://localhost:8000"
export const API_URLS = {
  "apiLoginUrl": API_URL_ORIGIN+"/api/login/",
  "artisteUrl": API_URL_ORIGIN+"/artiste/",
  "test": API_URL_ORIGIN+"/test/"
};

export const TOKENS = {
  authentificationToken: null,
  cscrfToken: null
}

export const HEADERS = {
  'Content-Type': 'application/json'
}

const API_USER = {
  username: "aaapiuser",
  password: "toortoor"
}

function saveAuthentificationToken(token){
  console.log("token :) ",token)
  TOKENS.authentificationToken = token;
  HEADERS.Authorization = `token ${TOKENS.authentificationToken}`;
}

export function initApiConnection(){
  const requestOptions = {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(API_USER)
  };

  fetch(API_URLS.apiLoginUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        saveAuthentificationToken(data.key)
      },
      (error)=>{
        console.log("Erreur lors de la récupération du token");
        console.error(error);
      });
}


export function shortenNumber(number){
  // #TODO : formater le nombre envoyer. ex: 12000 => 12K
  // return number;
  return "1M";
}

/**
 * custom uniq id
 * @param {*} val 
 * @returns 
 */
export function cuniqid(val){
  return uniqid(val+"-")
}

