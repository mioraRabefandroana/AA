import './LoginForm.css';
import { Button } from "./Form";
import { getAuthentifiedUser, login, saveCurrentUser } from "../UserManager";
import { useState } from 'react';
import { gotoExplore } from '../App';


export function LoginForm(){
    const [password, setPassword] = useState(null)
    const [username, setUsername] = useState(null)
    const [msg, setMessage] = useState("");

    const handleUsernameChange = function(val){
        setUsername(username => val)
    }
    const handlePasswordChange = function(val){
        setPassword(password => val)
    }

    const logUser = async function(){
        try{
            // log in
            await login(username, password);

            // authentification completed
            const user = await getAuthentifiedUser(username);
            saveCurrentUser(user);

            console.log(user);

            // clear message
            setMessage(msg => "")

            gotoExplore();
        }
        catch(error){
            setMessage(msg => error.message)
        }        
    }

    const msgElt = msg ? <div className="login-form-message">{ msg }</div> : ""

    const register = function(){
        console.log(username, password)
    }

    return <form id="login-form">
        { msgElt }
        <UserField onChange={ handleUsernameChange }/>
        <PasswordField onChange={ handlePasswordChange }/>
        <Button className="login-connexion-btn" onClick={ logUser }>connexion</Button>
        <div className="login-register-btn-wrapper">
            <RegisterButton onClick={ register }/>
        </div>
    </form>
}

function Field({name, id, type, placeholder, icon, onChange}){
    const inputType = type || "text";
    const inputPlaceholder = placeholder || "";

    const [value, setValue] = useState("")

    const handleChange = function (e){
        e.preventDefault();
        setValue(e.target.value);
        onChange(e.target.value)
    }

    return <div className="field" id={ id }>
        { icon ? <img src={ icon } alt={ name } /> : "" }
        <input 
            className="field-input" 
            type={ inputType } 
            name={ name } 
            value = { value }
            placeholder={ inputPlaceholder }
            onChange={ handleChange }/>
    </div>
}


function UserField({onChange}){
    return <Field 
        name="username" 
        id="login-user" 
        placeholder="nom d'utilisateur"
        onChange={onChange}/>
}



function PasswordField({onChange}){
    return <Field 
        name="password" 
        id="login-password" 
        type="password" 
        placeholder="mot de passe"
        onChange={ onChange }/>
}

function RegisterButton(){
    const registerBtnText = "S'enregistrer";
    return <a href="#register" className="login-register-btn">
        { registerBtnText }
    </a>
}