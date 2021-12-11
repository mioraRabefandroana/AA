import { useState } from "react"
import { Button, Field, TextAreaField } from "../form/Form"
import './Profile.css'
import { ExploreHeader, ExploreRightMenu } from "./Explore"
import { updateUser } from "../UserManager"
import defaultCoverPicture from "../img/default-cover-picture.png"
import defaultProfilePicture from "../img/user.png"

export function Profile({user, header=true, activeMenu=PROFILE_MENU.INFO}){
    const [menu, setMenu] = useState(activeMenu);

    const handleUserSave = function(user){     
        // submit update user
        updateUser(user);
    }
    
    const menuHandleChange = function(activeMenu){
        setMenu(menu => activeMenu);
    }

    return <div className="user-profile">
        {/* {JSON.stringify(user)} */}

        { header ? <ExploreHeader user={ user }/> : ""}
        <ProfileHeader user={ user }/>
        <ProfileNav user={ user } onMenuChange={ menuHandleChange }/>
        <div className="profile-content-wrapper">
            <ProfileContent user={ user } activeMenu={ menu }   onUserSave={ handleUserSave }/>
        </div>
        <ExploreRightMenu notifications={ ["test"] } messages={ ["test"] }/>
        <ProfileFooter user={ user }/>
    </div>
}

const PROFILE_MENU = {
    INFO: "info",
    PUBLICATION: "publication",
    WORK: "work"
}

/** header */
function ProfileHeader({user}){
    return <div className="user-profile-header">
        <CoverPicture src={ user.coverPicture }/>
        <div className="user-profile-picture-wrapper">
            <ProfilePicture  src={ user.profilePicture }/>
        </div>
    </div>
}

function CoverPicture({src}){
    return <div className="user-profile-cover">
        <img src={ src || defaultCoverPicture} alt="photo de couverture" className="user-profile-cover-image" />
    </div>
}
function ProfilePicture({src}){
    return <div className="user-profile-picture">
        <img src={ src || defaultProfilePicture } alt="photo de profile" className="user-profile-cover-image" />
    </div>
}


/** nav */
function ProfileNav({onMenuChange}){
    const [activeMenu, setActivatedMenu] = useState(PROFILE_MENU.INFO);
    
    const handleClick = function(e){
        e.preventDefault();
        const menu  = e.target.getAttribute("menu");
        if(!menu)
            return;
        setActivatedMenu(activeMenu => menu);
        onMenuChange(menu);
    }

    return <nav className="profile-nav">
        <ul>
            <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.INFO).toLocaleString()} onClick={ handleClick }>
                <a href="#info" menu={ PROFILE_MENU.INFO }>Mes informations</a>
            </li>
            <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.PUBLICATION).toLocaleString()} onClick={ handleClick }>
                <a href="#publication" menu={ PROFILE_MENU.PUBLICATION }>Publications</a>
            </li>
            <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.WORK).toLocaleString()} onClick={ handleClick }>
                <a href="#work" menu={ PROFILE_MENU.WORK }>Mes ouvrages</a>
            </li>
        </ul>
    </nav>
}


/** content */
function ProfileContent({activeMenu, user, onUserSave, onFieldChange, onCancel}){
    // activeMenu=PROFILE_MENU.INFO
    let menu = null;
    switch (activeMenu) {
        case PROFILE_MENU.INFO:
            menu = <ProfileInfos user={ user } onUserSave={ onUserSave } onFieldChange={ onFieldChange } onCancel={ onCancel }/>
            break;
        case PROFILE_MENU.PUBLICATION:
            menu = <ProfilePublications user={ user }/>
            break;
        case PROFILE_MENU.WORK:
            menu = <ProfileWorks user={ user }/>
            break;
    
        default:
            break;
    }
    return <div className="profile-content">
        { menu }
    </div>
}

function ProfileInfos({user, onUserSave}){
    const [readOnly, setReadOnly] = useState(true);

    const initialUser = {...user};

    const [
        {
            biography, 
            name, 
            firstName,
            email, 
            tel, 
            dateOfBirth, 
            placeOfBirth, 
            address
        }, 
        setUser
    ] = useState(user);
    
    const editProfile = function(e){
        setReadOnly(readOnly => false);
    }

    const handleProfileSave = function(e){
        setReadOnly(readOnly => true);
        onUserSave({...user, 
            biography, 
            name, 
            firstName,
            email, 
            tel, 
            dateOfBirth, 
            placeOfBirth, 
            address
        });
    }
    const handleCancel = function(e){
        setReadOnly(readOnly => true);
        setUser(user => {
            return {...initialUser}
        });
    }
   
    const button = readOnly ?
        <Button onClick={ editProfile } id="edit-profile-btn" className="edit-profile-btn">Modifier</Button> :

        <div className="save-profile-btn-wrappe">
            <Button onClick={ handleCancel } id="edit-profile-btn" className="edit-profile-btn">Annuler</Button>
            <Button onClick={ handleProfileSave } id="edit-profile-btn" className="edit-profile-btn">Enregistrer</Button>
        </div>

    const handleChange = function(e){
        const {name, value} = e.target;
        setUser(user => {
            return {...user, [name]: value}
        });
    }

    return <div className="profile-infos"> 
        <TextAreaField name="biography" label="Biographie" id="profile-biography" onChange={ handleChange } readOnly={ readOnly } value={ biography }/>
        <Field name="name" label="Nom" id="profile-name" onChange={ handleChange } readOnly={ readOnly } value={ name }/>
        <Field name="firstName" label="Prénoms" id="profile-firstName" onChange={ handleChange } readOnly={ readOnly } value={ firstName }/>
        {/* <Field name="username" label="pseudo" id="profile-firstName" onChange={ handleChange } readOnly={ readOnly } value={ updatedUser.username }/> */}
        <Field type="email" name="email" label="E-mail" id="profile-email" onChange={ handleChange } readOnly={ readOnly } value={ email }/>
        <Field name="tel" label="Téléphone" id="profile-telephone" onChange={ handleChange } readOnly={ readOnly } value={ tel }/>

        <Field type="date" name="dateOfBirth" label="Date de naissance" id="profile-dateOfBirth" onChange={ handleChange } readOnly={ readOnly } value={ dateOfBirth }/>
        <Field name="placeOfBirth" label="Lieu de naissance" id="profile-placeOfBirth" onChange={ handleChange } readOnly={ readOnly } value={ placeOfBirth }/>
        <Field name="address" label="Adresse" id="profile-address" onChange={ handleChange } readOnly={ readOnly } value={ address }/>

        { button }
    </div>
}


function ProfilePublications({user}){
    const publications = getUserPublications(user)
    return <div className="profile-publications">
        { publications }
    </div>
}

function getUserPublications(user){
    // TODO : récupérer les vraies publications pour l'utilisateur
    let publications = Array.from(Array(10).keys())
    return publications.map(i => "publication "+i);
}


function ProfileWorks({user}){
    const works = getUserWorks(user)
    return <div className="profile-works">
        { works }
    </div>
}

function getUserWorks(user){
    // TODO : récupérer les vraies ouvrage pour l'utilisateur
    let works = Array.from(Array(10).keys())
    return works.map(i => "ouvrage "+i);
}

/** footer */
function ProfileFooter({}){
    return <div className="profile-footer">

    </div>
}