
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
  "apiLoginUrl": API_URL_ORIGIN+"/user/login/",
  "artisteUrl": API_URL_ORIGIN+"/artiste/",
  "test": API_URL_ORIGIN+"/test/",

  "userByusername" : function(username){
      return API_URL_ORIGIN+"/utilisateur/?user__username=" + username;
  },
  "userRegister" : API_URL_ORIGIN+"/api/user/register"

};

export const TOKENS = {
  authentificationToken: null,
  cscrfToken: null
}

export const HEADERS = {
  'Content-Type': 'application/json'
}

// const API_USER = {
//   username: "user1",
//   password: "toortoor"
// }

// const AA_USER = {
//   username: null,
// }

export const ERROR_MSG = {
    AUTH_FAILED: "Echec d'authentification",
    USER_NOT_FOUND: "Cet utilisateur n'existe pas.",
    USER_REGISTER_FAILED: "Echec de la création du compte"
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

