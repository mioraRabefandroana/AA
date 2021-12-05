import React, { useEffect } from 'react';
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

import './Explore.css';

import { Button, FloatButton, SearchBar } from '../form/Form';
import aaLogo from '../img/aa_logo.png';
import jainImage from '../img/jain.jpg';

import { cuniqid, PRODUCT_TYPE, PUBLICATION_CONTENT_TYPE, BADGE, HEADERS, API_URL, API_URLS } from '../Utilities';
import tmpMenuIcon from '../img/super-star-2.jpg'
import { CardList } from './Card';
import { Publication } from './Publication';
import { gotoHome, gotoLogin, gotoProfile } from '../App';
import { getTop5, loadExploreData } from './ExploreData'
import { CURRENT_USER } from '../UserManager';

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


export function Explore({user}){
    // #TODO : notifications et messages
    // console.log(PUBLICATIONS);
    const rightMenu = user ? 
        <ExploreRightMenu notifications={ ["test"] } messages={ ["test"] }/> 
        : "";
    
    useEffect(async () => { 
        console.log("auth user = ", user);
        const data = await loadExploreData() ;
        console.log("ExploreData :", data)
    }, [])

    return <div id="explore">
        <ExploreHeader user={ user }/>        
        <ExploreLeftMenu/>
        <ExploreContent topArtists={ TOP_ARTISTS } publications={ PUBLICATIONS }/>    
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
        gotoHome();
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
    console.log(">>>",user);
    const className = (user) ? "user-info-btn" : "nav-connexion-btn";
    const text = (user) ? user.username : "Se connecter";
    const icon = (user) ? ( (user.image) ? user.image : defaultUserIcon ) : null;

    const handleClick = function(){
        if(user)
            gotoProfile({user});
        else
            gotoLogin();
    }

    return <div className="user-info">
        <Button className={ className } icon={ icon } onClick={ handleClick }>{ text }</Button>
    </div>
}

function ExploreContent({topArtists, publications}){
    console.log(publications);

    return <div id="explore-content" className="content">
            <CardList artists={ topArtists } id="top-5"/>
            <div className="publications-wrapper">
            { 
                publications.map(publication => <Publication publication={ publication } key={ cuniqid(publication.name) }/>)
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


function ExploreRightMenu({notifications, messages}){
    return <div className="explore-right-menu menu">
        <ul>
            <li>
                <NotificationFloatButton notifications={ notifications }/>
            </li>
            <li>
                <MessageFloatButton messages={ messages }/>
            </li>
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