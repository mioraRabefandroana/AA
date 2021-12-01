import React from 'react';
import './Home.css';
import aaLogo from '../img/aa_logo.png';
import mastercard from '../img/mastercard.png';
import { Button, SearchBar } from '../form/Form';
import { LoginForm } from '../form/LoginForm';
import { cuniqid } from '../Utilities'
import { gotoExplore } from '../App';

export function Home(){
    return <div id="home">
        <HomeHeader/>
        <HomeContent/>
        <HomeFooter/>
    </div>;
}

export function HomeHeader(){
    return <nav id="home-nav" className="nav top-nav">
        <SearchBar id="home-search-bar"/>
    </nav>
}


function HomeContent(){
    const text = descriptionText()
    return  <div className="content" id="home-content">
        <HomeExploreButton/>
        <AAHomeDescription>{text}</AAHomeDescription>
        <LoginForm/>
    </div> 
}

function HomeFooter(){
    const sponsors = getSponsors();
    return <footer>
        <div id="home-footer">
            <div className="home-footer-col home-footer-col-1">
                Lorem ipsum dolor sit amet consectetur 
                adipisicing elit. Porro dicta sapiente quis saepe? 
                Sed eius explicabo suscipit doloribus? Aliquam molestias quas et nisi quisquam nulla, neque unde! Quam, libero perferendis!
            </div>
            <div className="home-footer-col home-footer-col-3">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae provident quia perferendis cum sed libero. Praesentium omnis iusto soluta, libero optio est quo, sunt harum nesciunt nulla dignissimos facilis mollitia.
            </div>
            <div id="home-sponsor-wrapper" className="home-footer-col home-footer-col-3">
                {
                    sponsors.map(i => <img key={ cuniqid(i) } src={ mastercard } alt="" />)
                }
            </div>
        </div>
    </footer>
}

function HomeExploreButton(){
    const text = "EXPLORER";
    const handleClick = function(e){
        // e.preventDefault();
        gotoExplore();
    }

    return <Button className="home-explore-btn" icon="" onClick={ handleClick }>{text}</Button>
}


function AAHomeDescription({children}){
    return <div className="home-description-wrapper">
        <img className="home-description-img" src={ aaLogo } alt="" />
        <div className="home-description">
            {children}
        </div>
    </div>
}

function descriptionText(){
    // #TODO : change or get from db
    return 'Lorem ipsum dolor sit amet consectetur adipisicing elit. \nTemporibus voluptates laborum porro voluptas molestiae quos exercitationem molestias! Distinctio incidunt expedita, sed illo saepe rem alias quasi voluptatem dignissimos, impedit magni!';
}

function getSponsors(){
    // #TODO : get from DB
    const n = 15;
    const sponsors = [];
    for(let i=0; i<n; i++){
        sponsors.push("sponsor-"+i);
    }
    return sponsors;
}