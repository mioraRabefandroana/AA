import React from 'react';
import './Card.css';
import { cuniqid, PRODUCT_TYPE, PRODUCT_TYPE_ICON, shortenNumber } from '../Utilities'
import tmpMenuIcon from '../img/super-star-2.jpg'
import cardFollowBtnIcon from '../img/check-mark.png'
import followersNumberIcon from '../img/followers.png'


export function CardList({artists, id}){
    return <div id={ id } className="card-list">
        {
            artists.map(artist => <Card key={ cuniqid(artist.name) } artist={ artist } />)
        }
    </div>
}


function Card({artist}){
    // #TODO : gérer l'affichage de l'icône : plein si l'utilisateur le folow sinon vide
    const isFollowedByCurrentUser = false;
    return <div className="card">
        <CardFollowBtn isFollowedByCurrentUser={ isFollowedByCurrentUser }/>
        <CardImage image={ tmpMenuIcon }/>
        <CardContent artist={artist}/>
        <CardLineSep/>
        <CardProductList products={ artist.products }/>
    </div>
}

function CardFollowBtn({isFollowedByCurrentUser}){
    // #TODO : remplacer l'icône par la vraie : l'étoile vide/plein
    const btnIcon = isFollowedByCurrentUser ? "" : cardFollowBtnIcon;
    const title = isFollowedByCurrentUser ? "ne plus suivre" : "suivre";
    return <button className="card-follow-btn" title={ title }>
        <img src={ btnIcon } alt="follow" />
    </button>
}

function CardImage({image}){
    return <div className="card-image">
        <img src={ image } alt=""/>
    </div>
}

function CardContent({artist}){
    return <div className="card-content">
        <div className="card-content-header">
            <div className="card-name">
                { artist.name }
            </div>
            <CardFollowersNumber followersNumber={artist.followersNumber}/>
        </div>
        
        <CardLineSep/>
        <div className="card-description">
            { artist.talents.join(" - ") }
        </div>
    </div>
}

function CardFollowersNumber({followersNumber}){
    // #TODO : mettre la vraie icône de follower (le petit home sous form OK)
    const title = shortenNumber(followersNumber)+" abonné(e)s";
    return <div className="card-followers-number" title={ title }>
        { shortenNumber(followersNumber) }
        <img src={ followersNumberIcon } alt="follower number" />
    </div>
}

function CardProductList({products}){
    const cardProductListTitle = "Ouvrages";
    return <ul className="card-product-list">
        <div className="card-product-list-title"> { cardProductListTitle } </div>
        {
            products.map( product => <CardProductItem key={ cuniqid(product.name) } product={ product }/> )
        }
    </ul>
}

function CardProductItem({product}){
    return <li className="card-product-item">
        <img src={ PRODUCT_TYPE_ICON[product.type] } alt="ouvrage" className="card-product-item-icon" />
        { product.name }
    </li>
}

function CardLineSep(){
    return <div className="card-line-sep"></div>
}