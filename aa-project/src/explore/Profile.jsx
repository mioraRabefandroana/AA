import { useEffect, useState } from "react";
import { Button, Field, showModal, TextAreaField } from "../form/Form";
import './Profile.css';
import { ExploreHeader, ExploreRightMenu } from "./Explore";
import { updateArtist, updateUser, uploadCoverPicture, uploadImage, uploadProfilePicture } from "../UserManager";
import defaultCoverPicture from "../img/default-cover-picture.png";
import defaultProfilePicture from "../img/user.png";
import editIcon from "../img/edit-icon.png";
import { capitalize, PROFILE_MENU } from "../Utilities";
import { getUserPublications } from "./PulicationManager";
import { Publication } from "./Publication";

export function Profile({defaultUser, viewer, header=true, activeMenu=PROFILE_MENU.PUBLICATION}){
    
    const [user, setUser] = useState(defaultUser);

    const [currentViewer, setCurrentViewer] = useState(viewer);
    const [readOnly, setReadOnly] = useState( (!currentViewer || currentViewer.id != user.id) );

    activeMenu = user.artist ? activeMenu : PROFILE_MENU.INFO;
    const [menu, setMenu] = useState( activeMenu );
    const [publications, setPublications] = useState([]);

    /** on user updated*/
    const handleUserUpdate = function(user){
        setUser(u => user);
    }

    const handleUserSave = function(userNewData, updatedUser){     
        // submit update user
        updateUser(userNewData);
        handleUserUpdate(updatedUser);
        console.log([userNewData, updatedUser])
    }

    const handleArtistSave = function(artist){   
        // submit updated artist
        updateArtist(artist);
    }
    
    /** menu change handler */
    const menuHandleChange = function(activeMenu){
        setMenu(menu => activeMenu);
    }

    /** after publication created handler */
    const handleNewPublicationCreated = async function(publication){
        setPublications(p => [publication, ...p]);
        setMenu(menu => PROFILE_MENU.PUBLICATION);
    }


    /** on menu change to publication , get publications */
    useEffect(async ()=>{
        if(menu == PROFILE_MENU.PUBLICATION )
        {
            const userPublications = await getUserPublications(user);
            console.log("USER PUBLICATION : ", userPublications)
            setPublications(p => userPublications);
        }
    },[menu]);


    const handleProfileChange = function({user, viewer}){
        setCurrentViewer(v => viewer);
        setUser(u => user);
        // setReadOnly(r => user.id != viewer.id);
        setReadOnly(r => false);

    }

    return <div className="user-profile">
        { header ? <ExploreHeader user={ currentViewer } onProfileChange={ handleProfileChange }/> : ""}
        <ProfileHeader user={ user } onUserUpdate={ handleUserUpdate } readOnly={ readOnly } />
        <ProfileNav user={ user } activeMenu={ menu } onMenuChange={ menuHandleChange }/>
        <div className="profile-content-wrapper">
            <ProfileContent user={ user } publications={ publications } activeMenu={ menu }  onUserSave={ handleUserSave } onArtistSave={ handleArtistSave }  readOnly={ readOnly }/>
        </div>
        <ExploreRightMenu user={ user } notifications={ ["test"] } messages={ ["test"] } onNewPublicationCreated={ handleNewPublicationCreated } readOnly={ readOnly }/>
        <ProfileFooter user={ user }/>
    </div>
}

/** header */
function ProfileHeader({user, onUserUpdate, readOnly}){
    return <div className="user-profile-header">
        <CoverPicture user={ user }  readOnly={ readOnly }/>
        <div className="user-profile-picture-wrapper">
            <ProfilePicture user={ user } onUserUpdate={ onUserUpdate } readOnly={ readOnly }/>
        </div>
    </div>
}

function CoverPicture({user, readOnly}){
    const [coverPicture, setCoverPicture] = useState(user.coverPicture)

    const showCoverPicture = function(e){
        if(!user.coverPicture)
            return;
        showModal( <ImageViewer src={ user.coverPicture }/> );
    }

    const handleCoverChange = async function(e){
        const coverPictureFile = e.target.files[0];
        if(!coverPictureFile)
            return;
        
        const [filename, message] = await uploadCoverPicture(coverPictureFile, user.id);
        if(!filename)
        {
            alert(message);
        }
        
        setCoverPicture(coverPicture => filename)
    }

    const editBtn = readOnly ? "" :  <>
        <input id="user-profile-cover-file" className="picture-upload-input" type="file" name="coverPicture" onChange={ handleCoverChange }/>
            <label htmlFor="user-profile-cover-file" className="user-profile-cover-edit-btn" title="modifier la photo de couverture">
                <img src={ editIcon } alt="" />
        </label>
    </>

    return <div className="user-profile-cover">
        { editBtn }
        <img src={ coverPicture || defaultCoverPicture} alt="photo de couverture" className="user-profile-cover-image" onClick={ showCoverPicture }/>
    </div>
}

function ProfilePicture({user, onUserUpdate, readOnly}){
    const handlePictureChange = async function(e){
        const profilePictureFile = e.target.files[0];
        if(!profilePictureFile)
            return;
        
        const [filename, message] = await uploadProfilePicture(profilePictureFile, user.id);        
        if(!filename)
        {
            alert(message);
        }
                
        user = {...user, profilePicture: filename};
        onUserUpdate(user);
    }

    const showProfilePicture = function(e){
        if(!user.profilePicture)
            return;

        showModal( <ImageViewer src={ user.profilePicture }/> );
    }

    const fullName = capitalize( user.firstName ) +" "+ user.name.toUpperCase();

    const editBtn = readOnly ? "" : <>
        <label htmlFor="user-profile-picture-file" className="user-profile-picture-edit-btn" title="modifier la photo de profil">
            <img src={ editIcon } alt="" />
        </label>
        <input id="user-profile-picture-file" className="picture-upload-input" type="file" name="profilePicture" onChange={ handlePictureChange }/>
    </>

    return <>
        <div className="user-profile-picture">
            <img 
                src={ user.profilePicture || defaultProfilePicture } 
                className="user-profile-picture-image" 
                title="voir la photo"
                onClick={ showProfilePicture }/>
            { editBtn }
        </div>
        
        <div className="profile-user-full-name" title={ fullName }>{ fullName}</div>
    </>
}


/** nav */
function ProfileNav({user, activeMenu, onMenuChange}){
    const handleClick = function(e){
        const menu  = e.target.getAttribute("menu");
        onMenuChange(menu);
    }

    let artistMenu = ""
    let workMenu = ""
    let publicationMenu = ""
    if(user.artist)
    {
        artistMenu = <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.ARTIST).toLocaleString()} onClick={ handleClick }>
            <a href="#info" menu={ PROFILE_MENU.ARTIST }>Infos Artiste</a>
        </li>

        
        workMenu = <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.WORK).toLocaleString()} onClick={ handleClick }>
            <a href="#work" menu={ PROFILE_MENU.WORK }>Mes ouvrages</a>
        </li>

        publicationMenu = <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.PUBLICATION).toLocaleString()} onClick={ handleClick }>
            <a href="#publication" menu={ PROFILE_MENU.PUBLICATION }>Publications</a>
        </li>
    }
    
        

    return <nav className="profile-nav">
        <ul>
            { publicationMenu }
            { workMenu }
            <li className="profile-nav-item" active={ (activeMenu === PROFILE_MENU.INFO).toLocaleString()} onClick={ handleClick }>
                <a href="#info" menu={ PROFILE_MENU.INFO }>Infos Général</a>
            </li>
            { artistMenu }
            
        </ul>
    </nav>
}


/** profile content */
function ProfileContent({activeMenu, user, publications=[], onUserSave, onArtistSave, onFieldChange, onCancel, readOnly}){
    // activeMenu=PROFILE_MENU.INFO
    let menu = null;
    switch (activeMenu) {
        case PROFILE_MENU.INFO:
            menu = <ProfileInfoUser user={ user } onUserSave={ onUserSave } onFieldChange={ onFieldChange } onCancel={ onCancel } readOnly={ readOnly }/>
            break;
        case PROFILE_MENU.ARTIST:
            if(user.artist)
                menu = <ProfileInfoArtist artist={ user.artist } onArtistSave={ onArtistSave } onFieldChange={ onFieldChange } onCancel={ onCancel } readOnly={ readOnly }/>
            break;
        case PROFILE_MENU.PUBLICATION:
            if(user.artist)
                menu = <ProfilePublications user={ user } publications={ publications } readOnly={ readOnly }/>
            break;
        case PROFILE_MENU.WORK:
            if(user.artist)
                menu = <ProfileWorks user={ user } readOnly={ readOnly }/>
            break;
    
        default:
            break;
    }
    return <div className="profile-content">
        { menu }
    </div>
}

function ProfileInfoUser({user, onUserSave, readOnly}){
    const [notOnUpdate, setNotOnUpdate] = useState(true);

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
        setNotOnUpdate(notOnUpdate => false);
    }

    const handleProfileSave = function(e){
        setNotOnUpdate(notOnUpdate => true);
        let updatedUser = {...user, 
            biography, 
            name, 
            firstName,
            email, 
            tel, 
            dateOfBirth, 
            placeOfBirth, 
            address
        }

        let userNewData = {
            id: user.id,
            biography, 
            name, 
            firstName,
            email, 
            tel, 
            dateOfBirth, 
            placeOfBirth, 
            address
        }
        onUserSave(userNewData, updatedUser);
    }
    const handleCancel = function(e){
        setNotOnUpdate(notOnUpdate => true);
        setUser(user => {
            return {...initialUser}
        });
    }
   console.log("readOnly", readOnly)
    const button = (readOnly===true) ? "" : ( notOnUpdate ?
        <Button onClick={ editProfile } id="edit-profile-btn" className="edit-profile-btn">Modifier</Button> :

        <div className="save-profile-btn-wrappe">
            <Button onClick={ handleCancel } id="edit-profile-btn" className="edit-profile-btn">Annuler</Button>
            <Button onClick={ handleProfileSave } id="edit-profile-btn" className="edit-profile-btn">Enregistrer</Button>
        </div>)

    const handleChange = function(e){
        const {name, value} = e.target;
        setUser(user => {
            return {...user, [name]: value}
        });
    }

    return <div className="profile-infos"> 
        <TextAreaField name="biography" label="Biographie" id="profile-biography" onChange={ handleChange } readOnly={ notOnUpdate } value={ biography }/>
        <Field name="name" label="Nom" id="profile-name" onChange={ handleChange } readOnly={ notOnUpdate } value={ name }/>
        <Field name="firstName" label="Prénoms" id="profile-firstName" onChange={ handleChange } readOnly={ notOnUpdate } value={ firstName }/>
        {/* <Field name="username" label="pseudo" id="profile-firstName" onChange={ handleChange } readOnly={ readOnly } value={ updatedUser.username }/> */}
        <Field type="email" name="email" label="E-mail" id="profile-email" onChange={ handleChange } readOnly={ notOnUpdate } value={ email }/>
        <Field name="tel" label="Téléphone" id="profile-telephone" onChange={ handleChange } readOnly={ notOnUpdate } value={ tel }/>

        <Field type="date" name="dateOfBirth" label="Date de naissance" id="profile-dateOfBirth" onChange={ handleChange } readOnly={ notOnUpdate } value={ dateOfBirth }/>
        <Field name="placeOfBirth" label="Lieu de naissance" id="profile-placeOfBirth" onChange={ handleChange } readOnly={ notOnUpdate } value={ placeOfBirth }/>
        <Field name="address" label="Adresse" id="profile-address" onChange={ handleChange } readOnly={ notOnUpdate } value={ address }/>

        { button }
    </div>
}

function ProfileInfoArtist({artist, onArtistSave, readOnly}){
    const [notOnUpdate, setNotOnUpdate] = useState(true);

    const initialArtist = {...artist,};

    const [{stageName}, setArtist] = useState(artist);
    
    const editProfile = function(e){
        setNotOnUpdate(notOnUpdate => false);
    }

    const handleProfileSave = function(e){
        setNotOnUpdate(notOnUpdate => true);
        onArtistSave({...artist, stageName});
    }
    const handleCancel = function(e){
        setNotOnUpdate(notOnUpdate => true);
        setArtist(artist => {
            return {...initialArtist}
        });
    }
   
    const button = readOnly ? "" : (notOnUpdate ?
        <Button onClick={ editProfile } id="edit-profile-btn" className="edit-profile-btn">Modifier</Button> :

        <div className="save-profile-btn-wrappe">
            <Button onClick={ handleCancel } id="edit-profile-btn" className="edit-profile-btn">Annuler</Button>
            <Button onClick={ handleProfileSave } id="edit-profile-btn" className="edit-profile-btn">Enregistrer</Button>
        </div>)

    const handleChange = function(e){
        const {name, value} = e.target;
        setArtist(artist => {
            return {...artist, [name]: value}
        });
    }

    return <div className="profile-artist"> 
        <Field name="stageName" label="Nom de scène" id="profile-stageName" onChange={ handleChange } readOnly={ notOnUpdate } value={ stageName }/>

        { button }
    </div>
}



export function ImageViewer({src}){
    return <div className="image-viewer">
        <img src={ src } alt="photo de profil" />
    </div>
}

/**
 * profile publications
 *  user publications list
 * @param {*} param0 
 * @returns 
 */
function ProfilePublications({user, publications=[]}){
    return <div className="profile-publications">
        { 
            publications.map(p => (<Publication publication={ p } user={ user } publisher={ user } key={ p.id } />))
        }
    </div>
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