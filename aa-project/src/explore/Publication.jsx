import React, { useRef, useState } from 'react';
import likeLineIcon from '../img/heart-line.svg';
import likeFilledIcon from '../img/heart-filled.svg';
import commentLineIcon from '../img/comment-line.png';
import commentFiledIcon from '../img/comment-filled.png';
import shareLineIcon from '../img/share-line.png';
import shareFilledIcon from '../img/share-filled.png';
import defaultProfilePicture from "../img/user.png";

import './Publication.css';
import { cuniqid, ERROR_MSG, PUBLICATION_CONTENT_TYPE, shortenNumber, SUCCESS_MSG } from '../Utilities';
import { Button, closeModal } from '../form/Form';
import { createNewPublication } from './PulicationManager';

export function Publication({publication}){
    return <div className="publication">  
        <PublicationContentWrapper publication={ publication }/>
        <PublicationCommentsWrapper comments={ publication.comments }/>
    </div>
}

function PublicationContentWrapper({publication}){
    const likesNumber = publication.likes ? publication.likes.length : 0;

    const contentImageSrc = (publication.contents && publication.contents.length > 0 ) ? publication.contents[0].image : null;

    return <div className="publication-content-wrapper">
        
        { contentImageSrc ? <PublicationContent src={ contentImageSrc }/> : "" }

        <div className="publication-details-wrapper">     
            <div className="publication-details publication-details-name-and-likes">
                {/* #TODO : récupérer les bages : front + backend */}
                {/* <PublisherName badges={publication.userPublisher.badges}>{ publication.publisher.name }</PublisherName> */}
                <PublisherName badges={[]}>{ publication.userPublisher.fullname }</PublisherName>
                <PublicationLikes likesNumber={ likesNumber }/>
            </div>       
            <div className="publication-details publication-details-text-and-liked">
                <PublicationText>{ publication.text }</PublicationText>            
                <LikeButton liked={ publication.liked }/>
            </div>
        </div>

        <Publisher publisher={ publication.userPublisher }/>        
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

function PublicationContent({src}){
    // let content = null;
    // switch(type){
    //     case PUBLICATION_CONTENT_TYPE.image:
    //         content = <PublicationImage src={ src } />;
    //         break;
    //     default:

    // }
    const content = <PublicationImage src={ src } />;
    return <div className="publication-content">
        { content }
    </div>
}

function PublicationImage({src, name}){
    return <img src={ src } className="publication-image" />
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
    console.log("----------------------", publisher)
    return <div className="publication-publisher">
        <img src={ publisher.profilePicture || defaultProfilePicture } alt={ publisher.name } />
    </div>
}


export function NewPublication({user}){
    const [publication, setPublication] = useState(null);
    const publicationImg = useRef(null)
    const handleChange = function(e){  
        // value
        const {name, value} = e.target;
        setPublication(p => ({...p, [name]: value}) );
        console.log({name, value})
    }

    const handleFileChange = function(e){  
        // file
        const file = e.target.files ? e.target.files[0] : null;
        if( file )
        {
            setPublication(p => ({...p, image: file}));
            // debugger;
            // preview image
            publicationImg.current.src = URL.createObjectURL(file)
            return;
        }
        else
            publicationImg.current.src = ""
    }

    const handleClick = async function(){
        console.log(publication);
        const res = await createNewPublication(publication, user.id);
        if(res.publication)
        {
            alert(SUCCESS_MSG.NEW_PUBLICATION_SUCCESS);
            closeModal();
        }
        else
        {
            alert(ERROR_MSG.NEW_PUBLICATION_FAILED);
        }
    }
    // debugger;
    const publisher ={...user, image: user.profilePicture}
    return <div className="new-publication"> 
        <label>
            <input type="file" id="new-publication-input-image" name="image" onChange={ handleFileChange }/>
            <div htmlFor="new-publication-input-image" className="new-publication-content" title="ajouter une image">
                <img ref={ publicationImg } className="new-publication-image" src=""/>
            </div>
        </label> 
        
        <div className="new-publication-text-wrapper">
            <textarea 
                name="text" 
                id="new-publication-text" 
                className="new-publication-text"
                placeholder="votre texte ici"
                onChange={ handleChange }>

            </textarea>
        </div>
        <Publisher publisher={ publisher }/>  
        <div className="new-publication-btns-wrapper">
            <Button id="new-publication-btn" className="new-publication-btn" onClick={ handleClick }>Poster</Button>
        </div> 
    </div>
}