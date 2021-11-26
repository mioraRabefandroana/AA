import React from 'react';
import likeLineIcon from '../img/heart-line.svg';
import likeFilledIcon from '../img/heart-filled.svg';
import commentLineIcon from '../img/comment-line.png';
import commentFiledIcon from '../img/comment-filled.png';
import shareLineIcon from '../img/share-line.png';
import shareFilledIcon from '../img/share-filled.png';

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
                <PublisherName badges={publication.publisher.badges}>{ publication.publisher.name }</PublisherName>
                <PublicationLikes likesNumber={ likesNumber }/>
            </div>       
            <div className="publication-details publication-details-text-and-liked">
                <PublicationText>{ publication.text }</PublicationText>            
                <LikeButton liked={ publication.liked }/>
            </div>
        </div>

        <Publisher publisher={ publication.publisher }/>        
    </div>
}

function PublicationCommentsWrapper({comments}){
    // console.log(comments);
    return <div className="publication-comments-wrapper">
        <div className="publication-comments">
        {
            comments.map( comment =>  <Comment comment={ comment } key={ cuniqid(comment.author.name) }/>)
        
        }        
        </div>
        <div className="publication-comments-details">
            <CommentButton commented={ false } commentNumber={ 100 }/>
            <ShareButton shared={ false } shareNumber={ 100 } />
        </div>
    </div>
}

function CommentButton({commented, commentNumber}){
    const commentIcon = commented ? commentFiledIcon : commentLineIcon;
    return <div className="comment-btn-wrapper">
        <button className="comment-btn">
            <img src={ commentIcon } alt="comment" />
        </button>
        <div className="comment-number">{ shortenNumber(commentNumber) }</div>
    </div>
}

function ShareButton({shared, shareNumber}){
    const commentIcon = shared ? shareFilledIcon : shareLineIcon;
    return <div className="share-btn-wrapper">
        <button className="cshare-btn">
            <img src={ commentIcon } alt="share" />
        </button>
        <div className="share-number">{ shortenNumber(shareNumber) }</div>
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
            content = <PublicationImage src={ src } name={ name }/>;
            break;
        default:

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
    const likeIcon = liked ? likeFilledIcon : likeLineIcon;
    const likeTitle = liked ? "unlike" : "like";
    return <button className="like-btn" title={ likeTitle }>
        <img src={ likeIcon } alt="like" />
    </button>
}

function PublicationLikes({likesNumber}){
    const numbers = shortenNumber(likesNumber);
    return <div className="publication-likes" title={ numbers }>
        <img src={ likeFilledIcon } alt="like" />
        <div className="publication-likes-number">
            { numbers }
        </div>
    </div>
}

function PublisherName({badges, children}){
    const badgeElts = (badges && badges.length > 0)? 
        badges.map(badge => <UserBadge name={ badge.name } icon={ badge.icon } key={ cuniqid(badge.name) }/>)
        : "";
    return <div className="publication-publisher-name">
        { children }
        { badgeElts }
    </div>
}

function Publisher({publisher}){
    return <div className="publication-publisher">
        <img src={ publisher.image } alt={ publisher.name } />
    </div>
}