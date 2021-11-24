import React from 'react';
import logo from '../logo.svg';
import './Publication.css';
import { cuniqid, PUBLICATION_CONTENT_TYPE, shortenNumber } from '../Utilities';

export function Publication({publication}){
    return <div className="publication">  
        <PublicationContentWrapper publication={ publication }/>
        <PublicationCommentsWrapper comments={ publication.comments }/>
    </div>
}

function PublicationContentWrapper({publication}){
    const likesNumber = publication.likes.length;
    return <div className="publication-content-wrapper">
        <PublicationContent 
            name={ publication.name } 
            type={ publication.type } 
            src={ publication.src }/>

        <div className="publication-details-wrapper">     
            <div className="publication-details publication-details-name-and-likes">
                <PublicationArtistName>{ publication.publisher.name }</PublicationArtistName>
                <PublicationLikes likesNumber={ likesNumber }/>
            </div>       
            <div className="publication-details publication-details-text-and-liked">
                <PublicationText>{ publication.text }</PublicationText>            
                <LikeButton liked={ publication.liked }/>
            </div>
        </div>

        <PublicationPublisher publisher={ publication.publisher }/>        
    </div>
}

function PublicationCommentsWrapper({comments}){
    // console.log(comments);
    return <div className="publication-comments-wrapper">
        {
            comments.map( comment =>  <Comment comment={ comment } key={ cuniqid(comment.author.name) }/>)
        }        
    </div>
}

function Comment({comment}){
    // #TODO : mettre la vraie icône de badge
    const badges = (comment.author.badges) ? 
        comment.author.badges.map(
            badge => <UserBadge name={ badge.name } icon={ badge.icon } key={ cuniqid(badge.name) }/>
        ) : "";
    return <div className="comment">
        <img src={ comment.author.image } alt={ comment.author.name } className="comment-author-image" />
        <div className="comment-author-name">
            { comment.author.name }
            { badges }
        </div>
        <div className="comment-publish-time">{ comment.publishTime }</div>
        <div className="comment-text">
            <div className="comment-beak"></div>
            <p> { comment.text } </p>
        </div>
    </div>
}

function UserBadge({name, icon}){
    return <img 
        className="badge comment-author-badge"
        src={ icon } 
        alt={ name }/>
}

function PublicationContent({name, type, src}){
    let content = null;
    switch(type){
        case PUBLICATION_CONTENT_TYPE.image:
        content = <PublicationImage src={ src } name={ name }/>
    }
    return <div className="publication-content">
        { content }
    </div>
}

function PublicationImage({src, name}){
    return <img src={ src } alt={ name } className="publication-image" />
}

function PublicationText({children}){
    return <div className="publication-text">
        { children }
    </div>
}

function LikeButton({liked}){
    // #TODO : Remplacer par les vraie icône 
    const likeIcon = liked ? logo : logo;
    return <button className="like-btn" title="like">
        <img src={ likeIcon } alt="like" />
    </button>
}

function PublicationLikes({likesNumber}){
    // #TODO : Remplacer par la vraie icône 
    const fiiledLikeIcon = logo;
    const numbers = shortenNumber(likesNumber);
    return <div className="publication-likes" title={ numbers }>
        <img src={ fiiledLikeIcon } alt="like" />
        <div className="publication-likes-number">
            { numbers }
        </div>
    </div>
}

function PublicationArtistName({children}){
    return <div className="publication-publisher-name">
        { children }
    </div>
}

function PublicationPublisher({publisher}){
    return <div className="publication-publisher">
        <img src={ publisher.image } alt={ publisher.name } />
    </div>
}