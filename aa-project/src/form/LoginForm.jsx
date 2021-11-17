import './LoginForm.css';
import { Button } from "./Form";

export function LoginForm(){
    return <form id="login-form">
        <UserField/>
        <PasswordField/>
        <Button>connexion</Button>
        <div className="login-register-btn-wrapper">
            <RegisterButton/>
        </div>
    </form>
}

function Field({name, id, type, placeholder, icon}){
    const inputType = type || "text";
    const inputPlaceholder = placeholder || "";

    return <div className="field" id={id}>
        {icon ? <img src={icon}/> : ""}
        <input 
            className="field-input" 
            type={inputType} 
            name={name} 
            placeholder={inputPlaceholder}/>
    </div>
}


function UserField(){
    return <Field name="user" id="login-user" placeholder="nom d'utilisateur"/>
}

function PasswordField(){
    return <Field name="password" id="login-password" type="password" placeholder="mot de passe"/>
}

function RegisterButton(){
    return <a href="#register" className="login-register-btn">
        S'enregistrer
    </a>
}