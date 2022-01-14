// export function get_user(id=1){
//     return {
//         username:
//     }
// }
export const notValidUser = {
    username: "",
    password: ""
}
export const validUser = {
    id: 3,
    username: "fan1",
    password: "toor"
}
export const artistTest = {
    id: 6,
    username: "artist4",
    password: "toor"
}

export function getUserTest(){
    return [
        // vide
        {
            username: "",
            password: "",
            success: false
        },
        // sans mot de passe
        {
            username: "userTest",
            password: "",
            success: false
        },
        // sans utilisateur
        {
            username: "",
            password: "testPassword",
            success: false
        },
        // un utilisateur qui n'existe pas
        {
            username: "userTest",
            password: "testPassword",
            success: false
        },
        // un utilisateur valide et qui existe
        {
            username: "fan1",
            password: "toor",
            success: true
        }
    ]
}