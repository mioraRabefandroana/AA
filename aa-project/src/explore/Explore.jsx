import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import logo from '../logo.svg';
import bellFilled from '../img/bell-filled.png';
import messageFilled from '../img/message-filled.png';
import fire from '../img/fire.png';
import videoPlay from '../img/video-play.png';
import musicalNote from '../img/musical-note.png';
import photos from '../img/photos.png';
import paintPalette from '../img/paint-palette.png';
import shoppingCart from '../img/shopping-cart.png';
import defaultUserIcon from '../img/user.png';
import museeDuLouvreIcon from '../img/musee-du-louvre.png';
import pabloPicasso from '../img/pablo-picasso.jpg';
import plusIcon from '../img/plus-sign.png';
import minusIcon from '../img/minus-sign.png';
import afficheAthome from '../img/affiche-athome.jpeg';
import popcornTv from '../img/popcorn.png';
import brigitteLecordier from '../img/brigitte-lecordiert.png';
import liveIcon from '../img/live.png';
import dropdownIcon from "../img/dropdown.png";
import goupIcon from "../img/goup.png";

import './Explore.css';

import { Button, FloatButton, SearchBar, showModal } from '../form/Form';
import aaLogo from '../img/aa_logo.png';
import jainImage from '../img/jain.jpg';
import newIcon from '../img/croix-plus.png';

import { cuniqid, PRODUCT_TYPE, PUBLICATION_CONTENT_TYPE, BADGE, removeToken, getHeaders, API_URL, API_URLS, PROFILE_MENU } from '../Utilities';
import tmpMenuIcon from '../img/super-star-2.jpg'
import { CardList } from './Card';
import { NewPublication, Publication } from './Publication';
import { gotoExplore, gotoHome, gotoLogin, gotoProfile } from '../App';
import { getTop5, loadExploreData, getExplorePublications } from './ExploreData'
import { CURRENT_USER, getAuthentifiedUserFromSession, logout } from '../UserManager';

// #TODO : récuperer les top artists depuis la BD
const TOP_ARTISTS = [
    {
        name: "Elisabeth Leuvrey",
        talents: ["videaste", "commédienne", "camerawoman"],
        followersNumber: 1000000,
        products: [
            {
                name: "La traversé",
                type: PRODUCT_TYPE.film
            },
            {
                name: "At(h)ome",
                type: PRODUCT_TYPE.film
            },
            {
                name: "Matti Ke Lal, fils de la terre",
                type: PRODUCT_TYPE.film
            }
        ]
    }
]

// #TODO : temporary top_artist list
const n = 5;
for(let i=0; i<(n-1); i++)
{
    TOP_ARTISTS.push(TOP_ARTISTS[0]);
}


const PUBLICATIONS = [
    {
        name: "jain-publication",

        text: "Lorem ipsum dolor sit amet. Id dicta accusamus in itaque reprehenderit ad magni deleniti velit voluptas est nisi obcaecati et magnam consequatur eos architecto cupiditate.",
        publisher: {
            name: "Jain",
            image: jainImage,
            badges: [BADGE.star, BADGE.superstar]
        },
        
        type: PUBLICATION_CONTENT_TYPE.image,
        src: tmpMenuIcon,

        likes: [...Array(10).keys()],

        comments: [
            {
                text : "Lorem ipsum dolor sit amet. Ut mollitia eius ut facilis reiciendis et dolor quaerat ex rerum natus ex veniam aliquid qui quod quia",
                publishTime : "2min",
                author: {
                    name: "Parry Hotter",
                    image: logo,
                    badges: [BADGE.star]
                }
            },
            {
                text : "Lorem ipsum dolor sit amet. Ut mollitia eius ut facilis reiciendis et dolor quaerat ex rerum natus ex veniam aliquid qui quod quia",
                publishTime : "2min",
                author: {
                    name: "Parry Hotter",
                    image: logo,
                    badges: [BADGE.star]
                }
            }
        ]
    }
]
PUBLICATIONS.push(PUBLICATIONS[0])
PUBLICATIONS.push(PUBLICATIONS[0])


const USER = {
    name: "username",
    image: defaultUserIcon
}


// #TODO : changer les icônes/images du menu
const LEFT_MENUS = [
    {
        name: 'Expositions',
        className: 'exposition-menu',
        description: 'Expositions',
        icon: museeDuLouvreIcon,
        folded: true,
        content: [
            {
                name: 'Pablo Picasso',
                description: "le travail d'une vie",
                icon: pabloPicasso
            },
            {
                name: 'Pablo Picasso',
                description: "le travail d'une vie",
                icon: tmpMenuIcon
            },
            {
                name: 'Pablo Picasso',
                description: "le travail d'une vie",
                icon: tmpMenuIcon
            }
        ]
    },
    {
        name: 'Séance vidéos',
        description: 'Séance vidéos',
        className: 'seance-video-menu',
        icon: popcornTv,
        folded: false,
        content: [
            {
                name: 'Elisabeth Leuvrey',
                description: "AT(h)OME",
                icon: afficheAthome
            }
        ]
    },
    {
        name: 'Live',
        description: 'Live',
        className: 'live-menu',
        icon: liveIcon,
        folded: false,
        content: [
            {
                name: 'Brigitte Lecordier',
                description: "FAQ: DBS - OUI OUI",
                icon: brigitteLecordier 
            }
        ]
    }
];


export function Explore({}){
    const [user, setUser] = useState(null);
    const [publications, setPublications] = useState([]);

    const onNewPublicationCreated = function(publication){        
        const activeMenu = PROFILE_MENU.PUBLICATION;
        gotoProfile({user, activeMenu});
    }

    const rightMenu = user ? 
        <ExploreRightMenu user={ user } notifications={ ["test"] } messages={ ["test"] } onNewPublicationCreated={ onNewPublicationCreated } /> 
        : "";
    
    useEffect(async () => { 
        // console.log("auth user = ", user);
        if(!user)
        {
            const u = await getAuthentifiedUserFromSession(); 
            setUser(oldUser => u); 
        }

        let explorePublications = await getExplorePublications({user});
        setPublications(publications => explorePublications);
        console.log("explorePublications > ", explorePublications);
        // const data = await loadExploreData({user}) ;
                       
    }, [])

    
    const handleSubscribe = function(){
        console.log("xxxxxxxxxxx handleSubscribe");
        setPublications(ps => {
            return ps.map(p => {
                // if(p.publisher.id == publisher.id)
                //     p.publisher = {...p.publisher, ...publisher};
                // add current user into subscriber list
                p.publisher.subscribers = [...p.publisher.subscribers, user.id]
                return p;
            })
        })
    }
    
    const handleUnSubscribe = function(){
        console.log("Uxxxxxxxxxxx handleUnSubscribe");
        setPublications(ps => {
            return ps.map(p => {                
                // // remove current user from subscriber list
                // console.log("BEFORE",user.id, p.publisher.subscribers);
                // console.log("AFTER", p.publisher.subscribers.filter(sId => {
                //     console.log(sId,'vs', u.id, ' = ', sId!=sId)
                //     return sId!=u.id;
                // }));

                p.publisher.subscribers = p.publisher.subscribers.filter(i => i!=user.id);
                return p;
            })
        })
    }

    return <div id="explore">
        <ExploreHeader user={ user }/>        
        <ExploreLeftMenu/>
        <ExploreContent 
            user={ user } 
            topArtists={ TOP_ARTISTS } 
            publications={ publications } 
            onSubscribe={ handleSubscribe }
            onUnSubscribe={ handleUnSubscribe }/>    
        { rightMenu }
        <ExploreFooter/>
    </div>;
}

export function ExploreHeader({user}){
    return <nav id="explore-nav" className="nav top-nav">
        <ExploreIcon/>
        <ExplorerMenu/>
        <SearchBar id="explore-search-bar"/>
        <UserInfo user={ user }/>
    </nav>
}

function ExploreIcon(){
    const handleClick = function(e){
        e.preventDefault();
        gotoExplore({});
    }
    return <a id="explore-icon" href="#home" onClick={handleClick}>
        <img src={aaLogo} alt="aa_logo" />
    </a>
}

function ExplorerMenu({}){
    // #TODO : mettre les vraies icône pour chaqu menu
    const menus = [
        {name: "tendance", icon: fire},
        {name: "vidéos", icon: videoPlay},
        {name: "musique", icon: musicalNote},
        {name: "photos", icon: photos},
        {name: "peinture", icon: paintPalette},
        {name: "boutique", icon: shoppingCart}
    ]
    return <div id="explore-nav-menu">
        <ul>
            { menus.map( menu =>  <NavMenuItem key={ cuniqid(menu.name) } menu={menu}/> ) }
        </ul>
    </div>
}

function NavMenuItem({menu}){
    return <a className="nav-menu-item" href={'#'+menu.name}>
        <img src={menu.icon} alt="" />
        {menu.name}
    </a>
}

function UserInfo({user}){
    console.log("USER >>>",user);
    const className = (user) ? "user-info-btn" : "nav-connexion-btn";
    const text = (user) ? user.username : "Se connecter";
    const icon = (user) ? ( (user.profilePicture) ? user.profilePicture : defaultUserIcon ) : null;

    const handleClick = function(){
        if(user)
            gotoProfile({user});
        else
            gotoLogin();
    }

    const [dropDown, setDropDown] = useState(false)
    const handleDropDownClick = function(e){
        setDropDown(dpd => !dropDown);
    }

    const handleDisconnect = function(e){
        e.preventDefault();
        logout();
        // remove token
        removeToken();
        gotoHome();
    }

    const diconnectElt = <div>
        <div onClick={ handleDropDownClick }><img id="user-info-dropdown-img" src={ dropDown ?  goupIcon : dropdownIcon } alt="plus de menu" /></div>
        { 
            dropDown ?
                <ul id="user-info-dropdown-menu">
                    <li><a href="#deconnexion" onClick={ handleDisconnect }>deconnexion</a></li>
                </ul>
            : "" 
        }
    </div>

    return <div className="user-info">
        <Button className={ className } icon={ icon } onClick={ handleClick }>{ text }</Button>
        { user ? diconnectElt : ""}
    </div>
}

function ExploreContent({topArtists, publications, user, onSubscribe, onUnSubscribe}){
    console.log("PUBLICATIONS : ", publications);
    return <div id="explore-content" className="content">
            <CardList artists={ topArtists } id="top-5"/>
            <div className="publications-wrapper">
            { 
                publications.map(publication => <Publication 
                    publication={ publication } 
                    user={ user } 
                    onSubscribe={ onSubscribe }
                    onUnSubscribe={ onUnSubscribe }
                    key={ cuniqid(publication.name) }/>)
            }

            {/* { <Publication publication={ publications[0] }/> } */}
        </div>
    </div>
}

function ExploreFooter({}){
    return <footer>

    </footer>
}

function ExploreLeftMenu({}){
    const leftMenus = LEFT_MENUS;
    // #TODO : Ajouter l'icône fold/unfold
    return <div className="left-menu menu">
        <ul>
            {
                leftMenus.map(menu =>  <LeftMenuItem key={ cuniqid(menu.name) } menu={menu} />)
            }
        </ul>
    </div>
}

function LeftMenuItem({menu}){
    const foldIcon = menu.folded ? minusIcon : plusIcon;
    const title = menu.folded ? "réduire" : "voir plus";
    const menuItemClassName = "left-menu-item " + menu.className;
    return <li className={ menuItemClassName }>
        <div className="left-menu-item-header">
            <img src={ menu.icon } alt="-" className="left-menu-item-icon"/>
            {menu.name}
            <img src={ foldIcon } alt="-" className="left-menu-item-fold-btn" title={ title }/>
        </div>
        <ul>
            {
                menu.content.map(menu => <LeftSubMenuItem key={ cuniqid(menu.name) } menu={menu}/>)
            }
        </ul>
    </li>
}

function LeftSubMenuItem({menu}){
    const title = menu.description + "\n-" + menu.name;
    return <li className="left-submenu-item" title={title}>
        <img src={menu.icon} alt={menu.name} className="left-submenu-icon"/>
        <div>
            <div className="submenu-description">{menu.description}</div>
            <a className="submenu-header" href={"#"+menu.name}>{menu.name}</a>
        </div>
    </li>
}


export function ExploreRightMenu({user, notifications, messages, onNewPublicationCreated}){
    
    let newBtn = "";
    if( "artist" in user && user.artist && "id" in user.artist )
    {
        newBtn = <li> <NewFloatButton user={ user } onNewPublicationCreated={onNewPublicationCreated}/> </li>;
    }

    return <div className="explore-right-menu menu">
        <ul>
            <li>
                <NotificationFloatButton notifications={ notifications }/>
            </li>
            <li>
                <MessageFloatButton messages={ messages }/>
            </li>
            {
                newBtn
            }
            
        </ul>
    </div>
}

function NotificationFloatButton({notifications}){
    const notificationClick = function(e){};
    const notificationNumber = notifications.length ;
    const title = notificationNumber ? notificationNumber + " notifications" : "Pas de notification"
    return <FloatButton 
        icon={ bellFilled } 
        title={ title } 
        onClick={ notificationClick } 
        className="notification-btn" 
        number={ notificationNumber }/>
}

function MessageFloatButton({messages}){
    const messageClick = function(e){};
    const messageNumber = messages.length ;
    const title = messageNumber ? messageNumber + " messages" : "Pas de message"
    return <FloatButton 
        icon={ messageFilled } 
        title={ title } 
        onClick={ messageClick } 
        className="message-btn" 
        number={ messageNumber }/>
}

function NewFloatButton({user, onNewPublicationCreated}){
    const handleClick = function(e){
        showModal(<NewPublication {...{user, onNewPublicationCreated}}/>)
    };
    const title = "Créer du contenu";
    // plusIcon
    return <FloatButton 
        icon={ newIcon } 
        title={ title } 
        onClick={ handleClick } 
        className="new-btn"/>
}