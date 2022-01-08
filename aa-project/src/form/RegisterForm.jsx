
import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import { login, registerUser, saveCurrentUser } from '../UserManager';
import { gotoExplore, gotoProfile, root } from '../App';
import { FormMessage } from './LoginForm';
import './RegisterForm.css'
import { Field } from './Form';
export function RegisterForm({}){
    const [user, setUser] = useState({});
    const [msg, setmessage] = useState("")

    const handleChange = function(e){
        const {name, value} = e.target;
        setUser(user => {
            user = {...user, [name]: value}
            console.log("++new user register :", {[name]: value})
            console.log("new User : ", user)
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
            await login(user.username, user.password);
            ReactDOM.render(<RegisterSuccess user={ user }/>, root)
            
        }
        catch(error){
            console.log("ERROR REGISTER FORM : ",error)
            setmessage(msg => error.message)
        }
    }

    return <form action="" id="register-form" onSubmit={ submitUser }>
        <div id="register-form-header">
            <h2>Inscription</h2>
            <FormMessage>{ msg }</FormMessage>
        </div>
        <RegisterAccountTypeField onChange={ handleChange }  value={ user.accountType }/>
        <RegisterTextField name="name" label="Nom" id="register-name" onChange={ handleChange } />
        <RegisterTextField name="firstName" label="Prénoms" id="register-firstName" onChange={ handleChange }/>
        <RegisterTextField name="username" label="pseudo" id="register-username" onChange={ handleChange }/>
        <RegisterSexeField name="sex" id="register-sex" label="Sexe" onChange={ handleChange } />
        <RegisterMailField name="email" label="E-mail" id="register-email" onChange={ handleChange } />
        <RegisterTextField name="tel" label="Téléphone" id="register-telephone" onChange={ handleChange } />

        <RegisterDateField name="dateOfBirth" label="Date de naissance" id="register-dateOfBirth" onChange={ handleChange }/>
        <RegisterTextField name="placeOfBirth" label="Lieu de naissance" id="register-placeOfBirth" onChange={ handleChange } />
        <RegisterTextField name="address" label="Adresse" id="register-address" onChange={ handleChange }/>

        <br />
        <RegisterPasswordField name="password" label="mot de passe" id="register-mot_de_passe" onChange={ handleChange } />
        <RegisterPasswordField name="passwordConfirm" label="confirmation mot de passe" id="register-mot_de_passe" onChange={ handleChange } />
        {/* <RegisterTextField label="Photo de profil" id="register-photo_de_profil"/>
        <RegisterTextField label="Photo de couverture" id="register-photo_de_couverture"/> */}

        <div id="register-form-footer">
            <button className="btn" id="register-cancel-btn">annuler</button>
            <button className="btn" id="register-submit-btn" onClick={ submitUser }>Créer mon compte</button>
        </div>
    </form>
}


function RegisterAccountTypeField({onChange, value}){
    // const [accountType, setAccountType] = useState(null);
    // const handleChange = function(e){
    //     setAccountType(accountType => e.target.value)
    //     onChange("accountType", e.target.value)
    // }

    const chosenAccountTypeClassName = "chosen-account-type"
    const fanClassName = "register-account_type-item " + ( (value === "fan") ? chosenAccountTypeClassName : "" );
    const artisteClassName = "register-account_type-item " + ( (value === "artist") ? chosenAccountTypeClassName : "" );

    return <div className="register-account_type">
        <input type="radio" name="accountType" id="register-account_type-fan" value="fan" onChange={ onChange }/>
        <label className={ fanClassName } htmlFor="register-account_type-fan">Fan</label>
        <input type="radio" name="accountType" id="register-account_type-artist" value="artist" onChange={ onChange }/>
        <label className={ artisteClassName } htmlFor="register-account_type-artist">Artiste</label>
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

function RegisterTextField({label, id, name, value, onChange}){
    return <Field {...{label, id, name, value, onChange}}/>
}
function RegisterPasswordField({label, id, name, value, onChange}){
    const type = "password";
    return <Field {...{label, id, name, value, type, onChange}}/>
}
function RegisterMailField({label, id, name, value, onChange}){
    const type = "email";
    return <Field {...{label, id, name, value, type, onChange}}/>
}

function RegisterDateField({label, id, name, value, onChange}){
    const type = "date";
    return <Field {...{label, id, name, value, type, onChange}}/>
}

function RegisterSexeField({id, name, value, label, onChange}){
    // const [sex, setSexe] = useState("")
    // const handleChange = function(e){
    //     setSexe(sex =>  e.target.value);  
    //     onChange(name, e.target.value);      
    // }
    return <div className="field" id={ id }>
        { label }
        <div id="register-sex-field-details-wrapper">
            <div>
                <input id="sex-homme" type="radio" name={ name } value="HOMME" onChange={ onChange }/>
                <label htmlFor="sex-homme">homme</label>
            </div>
            <div>
                <input id="sex-femme" type="radio" name={ name } value="FEMME" onChange={ onChange }/>
                <label htmlFor="sex-femme">femme</label>
            </div>            
        </div>        
    </div>
}


