import React, { useRef, useState } from 'react';
import likeLineIcon from '../img/heart-line.svg';
import likeFilledIcon from '../img/heart-filled.svg';
import commentLineIcon from '../img/comment-line.png';
import commentFiledIcon from '../img/comment-filled.png';
import shareLineIcon from '../img/share-line.png';
import shareFilledIcon from '../img/share-filled.png';
import defaultProfilePicture from "../img/user.png";

import './Publication.css';
import { cuniqid, ERROR_MSG, PROFILE_MENU, PUBLICATION_CONTENT_TYPE, shortenNumber, SUCCESS_MSG } from '../Utilities';
import { Button, closeModal } from '../form/Form';
import { createNewPublication, isPublicationLikedByUser, likePublication, unlikePublication } from './PulicationManager';
import { gotoProfile } from '../App';

export function Publication({publication, publisher, user}){
    const[isLiked, setIsLiked] = useState( isPublicationLikedByUser(publication, user) )
    const [updatedPublication, setPublication] = useState(publication)
    const handleLike = async function(liked){        
        const pub = (!isLiked) ? await likePublication(updatedPublication, user) : await unlikePublication(updatedPublication, user);
        if(pub)
        {
            setPublication(p => pub);
            setIsLiked(i => !isLiked)
        } 
    }
    return <div className="publication">  
        <PublicationContentWrapper publication={ updatedPublication } publisher={ publisher } isLiked={ isLiked } onLiked={ handleLike }/>
        <PublicationCommentsWrapper comments={ updatedPublication.comments }/>
    </div>
}

function PublicationContentWrapper({publication, publisher, isLiked, onLiked}){
    const likesNumber = publication.likes ? publication.likes.length : 0;
    publisher = publisher || publication.userPublisher;
    const contentImageSrc = (publication.contents && publication.contents.length > 0 ) ? publication.contents[0].image : null;
    const publisherFullName = publisher.firstName + " " + publisher.name;
    return <div className="publication-content-wrapper">
        
        { contentImageSrc ? <PublicationContent src={ contentImageSrc }/> : "" }

        <div className="publication-details-wrapper">     
            <div className="publication-details publication-details-name-and-likes">
                {/* #TODO : récupérer les bages : front + backend */}
                {/* <PublisherName badges={publication.userPublisher.badges}>{ publication.publisher.name }</PublisherName> */}
                <PublisherName badges={[]}>{ publisherFullName }</PublisherName>
                <PublicationLikes likesNumber={ likesNumber }/>
            </div>       
            <div className="publication-details publication-details-text-and-liked">
                <PublicationText>{ publication.text }</PublicationText>            
                <LikeButton isLiked={ isLiked } onLiked={ onLiked }/>
            </div>
        </div>

        <Publisher publisher={ publisher }/>        
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

function LikeButton({isLiked, onLiked}){
    const likeIcon = isLiked ? likeFilledIcon : likeLineIcon;
    const likeTitle = isLiked ? "unlike" : "like";
    return <button className="like-btn" title={ likeTitle } onClick={ onLiked }>
        <img src={ likeIcon } alt="like" />
    </button>
}

function PublicationLikes({likesNumber}){
    const numbers = shortenNumber(likesNumber);
    const likeTitle = (numbers == 0 ) ? "Soyez le premier à liker ce post" : numbers+ " likes";
    return <div className="publication-likes" title={ likeTitle } >
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
        <img src={ publisher.profilePicture || defaultProfilePicture } alt={ publisher.name } />
    </div>
}


export function NewPublication({user, onNewPublicationCreated}){
    const [publication, setPublication] = useState(null);
    const publicationImg = useRef(null)
    const handleChange = function(e){  
        // value
        const {name, value} = e.target;
        setPublication(p => ({...p, [name]: value}) );
        // console.log({name, value})
    }

    const handleFileChange = function(e){  
        // file
        const file = e.target.files ? e.target.files[0] : null;
        if( file )
        {
            setPublication(p => ({...p, image: file}));
            // debugger;
            // preview image
            publicationImg.current.src = URL.createObjectURL(file);
            return;
        }
        else
            publicationImg.current.src = "";
    }

    /** submit new publication */
    const handleClick = async function(){
        console.log("New publication : ",publication);
        const res = await createNewPublication(publication, user.id);
        if(res.publication)
        {
            const newPublication = {...res.publication, userPublisher: user};
            onNewPublicationCreated(newPublication);
            // alert(SUCCESS_MSG.NEW_PUBLICATION_SUCCESS);
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