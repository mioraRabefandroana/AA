
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

export const API_URL_ORIGIN = "http://localhost:8000/"
export const API_URLS = {
  "apiLoginUrl": API_URL_ORIGIN+"user/login/",
  "artisteUrl": API_URL_ORIGIN+"artist/",
  "test": API_URL_ORIGIN+"test/",

  "userByusername" : function(username){
      return API_URL_ORIGIN+"aauser/?user__username=" + username;
  },
  "updateUser" : function(userId){
      return API_URL_ORIGIN+"aauser/" + userId +"/";
  },
  "userByToken" : API_URL_ORIGIN+"api/user/token/",
  "userRegister" : API_URL_ORIGIN+"api/user/register"

};

export const TOKENS = {
  authentificationToken: null,
  cscrfToken: null
}

export function getHeaders(){
    let HEADERS = {
        'Content-Type': 'application/json'
    }
    const authToken = getCookie("token");
    if(authToken)
        HEADERS.Authorization = `token ${authToken}`;
    
    return HEADERS
}


export const ERROR_MSG = {
    AUTH_FAILED: "Echec d'authentification",
    USER_NOT_FOUND: "Cet utilisateur n'existe pas.",
    USER_REGISTER_FAILED: "Echec de la création du compte",
    USER_UPDATE_FAILED: "Echec de la mise à jour des informations"
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


export function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}