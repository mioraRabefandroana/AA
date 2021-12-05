
import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import { registerUser, saveCurrentUser } from '../UserManager';
import { gotoExplore, gotoProfile, root } from '../App';
import { FormMessage } from './LoginForm';
import './RegisterForm.css'
import { Field } from './Form';
import { Profile } from '../explore/Profile';
export function RegisterForm({}){
    const [user, setUser] = useState({});
    const [msg, setmessage] = useState("")

    const handleChange = function(name, value){
        setUser(user => {
            user = {...user, [name]: value}
            console.log(user)
            return user;
        })
    }

    const submitUser = async function(e){
        e.preventDefault();
        try{
            const {success, field, message} = await registerUser(user);
            if(!success)
            {
                setmessage(msg => message);
                return;
            }

            setmessage(msg => "");
            saveCurrentUser(user);
            ReactDOM.render(<RegisterSuccess user={ user }/>, root)
            
        }
        catch(error){
            console.log(error)
            setmessage(msg => error.message)
        }
    }

    return <form action="" id="register-form">
        <div id="register-form-header">
            <h2>Inscription</h2>
            <FormMessage>{ msg }</FormMessage>
        </div>
        <RegisterAccountTypeField onChange={ handleChange }/>
        <RegisterTextField name="nom" label="Nom" id="register-nom" onChange={ handleChange }/>
        <RegisterTextField name="prenom" label="Prénoms" id="register-prenom" onChange={ handleChange }/>
        <RegisterTextField name="username" label="pseudo" id="register-prenom" onChange={ handleChange }/>
        <RegisterSexeField name="sexe" id="register-sexe" label="Sexe" onChange={ handleChange }/>
        <RegisterMailField name="email" label="E-mail" id="register-email" onChange={ handleChange }/>
        <RegisterTextField name="tel" label="Téléphone" id="register-telephone" onChange={ handleChange }/>

        <RegisterDateField name="date_de_naissance" label="Date de naissance" id="register-date_de_naissance" onChange={ handleChange }/>
        <RegisterTextField name="lieu_de_naissance" label="Lieu de naissance" id="register-lieu_de_naissance" onChange={ handleChange }/>
        <RegisterTextField name="adresse" label="Adresse" id="register-adresse" onChange={ handleChange }/>

        <br />
        <RegisterPasswordField name="password" label="mot de passe" id="register-mot_de_passe" onChange={ handleChange }/>
        <RegisterPasswordField name="passwordConfirm" label="confirmation mot de passe" id="register-mot_de_passe" onChange={ handleChange }/>
        {/* <RegisterTextField label="Photo de profil" id="register-photo_de_profil"/>
        <RegisterTextField label="Photo de couverture" id="register-photo_de_couverture"/> */}

        <div id="register-form-footer">
            <button className="btn" id="register-cancel-btn">annuler</button>
            <button className="btn" id="register-submit-btn" onClick={ submitUser }>Créer mon compte</button>
        </div>
    </form>
}


function RegisterAccountTypeField({onChange}){
    const [accountType, setAccountType] = useState(null);
    const handleChange = function(e){
        setAccountType(accountType => e.target.value)
        onChange("accountType", e.target.value)
    }

    const chosenAccountTypeClassName = "chosen-account-type"
    const fanClassName = "register-account_type-item " + ( (accountType === "fan") ? chosenAccountTypeClassName : "" );
    const artisteClassName = "register-account_type-item " + ( (accountType === "artiste") ? chosenAccountTypeClassName : "" );

    return <div className="register-account_type">
        <input type="radio" name="accountType" id="register-account_type-fan" value="fan" onChange={ handleChange }/>
        <label className={ fanClassName } htmlFor="register-account_type-fan">Fan</label>
        <input type="radio" name="accountType" id="register-account_type-artiste" value="artiste" onChange={ handleChange }/>
        <label className={ artisteClassName } htmlFor="register-account_type-artiste">Artiste</label>
    </div>
}

function RegisterSuccess({user, children}){
    const handleClick = function(e){
        e.preventDefault();
        gotoProfile({user});
    }

    const message = "Heureux de t'acceuillr parmis nous "+user.username+"!";
    return <div id="register-success">
        <h2>{ message }</h2>
        <a href="" id="register-success-btn" className="btn" onClick={ handleClick }>Accéder à mon profil</a>
    </div>
}

function RegisterTextField({label, id, name, onChange}){
    return <Field {...{label, id, name, onChange}}/>
}
function RegisterPasswordField({label, id, name, onChange}){
    const type = "password";
    return <Field {...{label, id, name, type, onChange}}/>
}
function RegisterMailField({label, id, name, onChange}){
    const type = "email";
    return <Field {...{label, id, name, type, onChange}}/>
}

function RegisterDateField({label, id, name, onChange}){
    const type = "date";
    return <Field {...{label, id, name, type, onChange}}/>
}

function RegisterSexeField({id, name, label, onChange}){
    const [sexe, setSexe] = useState("")
    const handleChange = function(e){
        setSexe(sexe =>  e.target.value);  
        onChange(name, e.target.value);      
    }
    return <div className="field" id={ id }>
        { label }
        <div id="register-sexe-field-details-wrapper">
            <div>
                <input id="sexe-homme" type="radio" name={ name } value="HOMME" onChange={ handleChange }/>
                <label htmlFor="sexe-homme">homme</label>
            </div>
            <div>
                <input id="sexe-femme" type="radio" name={ name } value="FEMME" onChange={ handleChange }/>
                <label htmlFor="sexe-femme">femme</label>
            </div>            
        </div>        
    </div>
}


