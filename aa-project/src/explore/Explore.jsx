import React from 'react';
import logo from '../logo.svg';
import './Explore.css';
import { Button, FloatButton, SearchBar } from '../form/Form';
import aaLogo from '../img/aa_logo.png';
import { cuniqid, PRODUCT_TYPE, PUBLICATION_CONTENT_TYPE, BADGE } from '../Utilities';
import tmpMenuIcon from '../img/super-star-2.jpg'
import { CardList } from './Card';
import { Publication } from './Publication';
import { gotoHome } from '../App';

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
            image: logo,
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
    image: logo
}

export function Explore({}){
    // #TODO : notifications et messages
    console.log(PUBLICATIONS);
    const rightMenu = USER ? 
        <ExploreRightMenu notifications={ ["test"] } messages={ ["test"] }/> 
        : "";
    return <div id="explore">
        <ExploreHeader user={ USER }/>        
        <ExploreLeftMenu/>
        <ExploreContent topArtists={ TOP_ARTISTS } publications={ PUBLICATIONS }/>    
        { rightMenu }
        <ExploreFooter/>
    </div>;
}

function ExploreHeader({user}){
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
        {name: "tendance", icon: tmpMenuIcon},
        {name: "vidéos", icon: tmpMenuIcon},
        {name: "musique", icon: tmpMenuIcon},
        {name: "photos", icon: tmpMenuIcon},
        {name: "peinture", icon: tmpMenuIcon},
        {name: "achat", icon: tmpMenuIcon}
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
    const className = (user) ? "user-info-btn" : "nav-connexion-btn";
    const text = (user) ? user.name : "Se connecter";
    const icon = (user) ? user.image : null;
    return <div className="user-info">
        <Button className={ className } icon={ icon }>{ text }</Button>
    </div>
}

function ExploreContent({topArtists, publications}){
    console.log(publications);

    return <div id="explore-content" className="content">
        <div>
            <CardList artists={ topArtists } />
            <div className="publications-wrapper">
            { 
                publications.map(publication => <Publication publication={ publication } key={ cuniqid(publication.name) }/>)
            }

            {/* { <Publication publication={ publications[0] }/> } */}
            </div>
        </div>
    </div>
}

function ExploreFooter({}){
    return <footer>

    </footer>
}

function ExploreLeftMenu({}){
    // #TODO : changer les icônes/images du menu
    const leftMenus = [
        {
            name: 'Expositions',
            description: 'Expositions',
            icon: tmpMenuIcon,
            content: [
                {
                    name: 'Pablo Picasso',
                    description: "le travail d'une vie",
                    icon: tmpMenuIcon
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
            name: 'Expositions',
            description: 'Expositions',
            icon: tmpMenuIcon,
            content: [
                {
                    name: 'Pablo Picasso',
                    description: "le travail d'une vie",
                    icon: tmpMenuIcon
                }
            ]
        }
    ];

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
    // #TODO : mettre la vraie icône de fold/unfold
    // #TODO : Gerer le mécanisme de fold/unfold (avec le changement d'icône)
    const foldIcon = logo;
    return <li className="left-menu-item">
        <div className="left-menu-item-header">
            <img src={ menu.icon } alt="-" className="left-menu-item-icon"/>
            {menu.name}
            <img src={ foldIcon } alt="-" className="left-menu-item-fold-btn"/>
        </div>
        <ul>
            {
                menu.content.map(menu => <LeftSubMenuItem key={ cuniqid(menu.name) } menu={menu}/>)
            }
        </ul>
    </li>
}

function LeftSubMenuItem({menu}){
    return <li className="left-submenu-item">
        <img src={menu.icon} alt={menu.name} />
        <div>
            <div className="submenu-header">{menu.name}</div>
            <div>{menu.description}</div>
        </div>
    </li>
}


function ExploreRightMenu({notifications, messages}){
    // #TODO : customiser le "title"
    // #TODO : 
    const notificationClick = function(e){};
    const messageClick = function(e){};
    return <div className="explore-right-menu menu">
        <ul>
            <li>
                <FloatButton 
                    icon={logo} 
                    title="notifications" 
                    onClick={ notificationClick } 
                    className="notification-btn" 
                    number={ notifications.length }/>
            </li>
            <li>
                <FloatButton 
                    icon={logo} 
                    title="messages" 
                    onClick={ messageClick } 
                    className="message-btn" 
                    number={ messages.length }/>
            </li>
        </ul>
    </div>
}