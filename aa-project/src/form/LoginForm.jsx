import './LoginForm.css';
import { Button } from "./Form";
import { getAuthentifiedUser, login, saveCurrentUser } from "../UserManager";
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { root, gotoExplore } from '../App';
import { RegisterForm } from './RegisterForm';

export function LoginForm(){
    const [username, setUsername] = useState("user1"); // DEBUG
    const [password, setPassword] = useState("toor"); // DEBUG
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
            // saveCurrentUser(user);

            // clear message
            setMessage(msg => "")

            gotoExplore({ user });
        }
        catch(error){
            setMessage(msg => error.message)
        }        
    }

    // const msgElt = msg ? <div className="form-message login-form-message">{ msg }</div> : ""

    /** show register form */
    const register = function(){
        ReactDOM.render( <RegisterForm/>, root);
    }

    return <form id="login-form">
        <FormMessage>{ msg }</FormMessage>
        <UserField onChange={ handleUsernameChange } value={ username }/>
        <PasswordField onChange={ handlePasswordChange } value={ password }/>
        <Button className="login-connexion-btn" onClick={ logUser }>connexion</Button>
        <div className="login-register-btn-wrapper">
            <RegisterButton onClick={ register }/>
        </div>
    </form>
}

export function FormMessage({children, className}){
    const msgClassName = "form-message " + className;
    return children ? <div className={ msgClassName } >{ children }</div> : ""
}

function LoginField({name, id, type, placeholder, icon, onChange, value}){
    const inputType = type || "text";
    const inputPlaceholder = placeholder || "";

    const [val, setValue] = useState(value)

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
            value = { val }
            placeholder={ inputPlaceholder }
            onChange={ handleChange }/>
    </div>
}


function UserField({onChange, value}){
    return <LoginField 
        name="username" 
        id="login-user" 
        placeholder="nom d'utilisateur"
        onChange={onChange}
        value={ value }/>
}


function PasswordField({onChange, value}){
    return <LoginField 
        name="password" 
        id="login-password" 
        type="password" 
        placeholder="mot de passe"
        onChange={ onChange }
        value={ value }/>
}

function RegisterButton({onClick}){
    const handleClick = function(e){
        e.preventDefault();
        onClick(e);
    }
    const registerBtnText = "S'enregistrer";
    return <a href="#register" className="login-register-btn" onClick={ handleClick }>
        { registerBtnText }
    </a>
}