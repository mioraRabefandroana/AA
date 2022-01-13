import React, { useRef, useState } from 'react';
import likeLineIcon from '../img/heart-line.svg';
import likeFilledIcon from '../img/heart-filled.svg';
import commentLineIcon from '../img/comment-line.png';
import commentFiledIcon from '../img/comment-filled.png';
import shareLineIcon from '../img/share-line.png';
import shareFilledIcon from '../img/share-filled.png';
import defaultProfilePicture from "../img/user.png";
import submitCommentIcon from "../img/paper-plane-solid.svg";

import './Publication.css';
import { cuniqid, ERROR_MSG, formatDateHour, PROFILE_MENU, PUBLICATION_CONTENT_TYPE, shortenNumber, SUCCESS_MSG } from '../Utilities';
import { Button, closeModal, showModal } from '../form/Form';
import { commentPublication, createNewPublication, isPublicationLikedByUser, likePublication, unlikePublication } from './PulicationManager';
import { gotoProfile } from '../App';
import { getAuthentifiedUserFromSession, getUserInfo, isAuthenticated, isUserSubscribed, subscribeToPublisher, unSubscribeFromPublisher } from '../UserManager';

export function Publication({
    publication, 
    publisher, 
    user, 
    // isSubscribed,
    onSubscribe=()=>{},
    onUnSubscribe=()=>{}
}){
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

    const handleComment = async function(text){
        const pub = await commentPublication(updatedPublication, user, text);
        if(pub)
        {
            setPublication(p => pub);
        } 
    }


    const [isSubscribed, setIsSubscribed] = useState( isUserSubscribed(user, publication.publisher) );
    const handleSubscribe = async function(){
        if(!isAuthenticated(user))
        {
            alert("Veuillez vous connectez pour s'abonner à cette page.")
            return;
        }

        const res = await subscribeToPublisher(user, publication.publisher); 
        setIsSubscribed(res);      

        onSubscribe(publication.publisher);
    }
    const handleUnSubscribe = async function(){
        const res = await unSubscribeFromPublisher(user, publication.publisher);
        setIsSubscribed(!res); 

        onUnSubscribe(publication.publisher);
    }

    // console.log([publication.publisher.name,publication.text, " : ",isSubscribed]);

    return <div className="publication">  
        <PublicationContentWrapper 
            user={ user } 
            publication={ updatedPublication } 
            publisher={ publisher } 
            isSubscribed= { isSubscribed }
            isLiked={ isLiked } 
            onLiked={ handleLike } 
            onSubscribe={ handleSubscribe } 
            onUnSubscribe={ handleUnSubscribe }/>
        <PublicationCommentsWrapper comments={ updatedPublication.comments } onNewCommentSubmitted={ handleComment } allowComment={ isAuthenticated(user) } />
    </div>
}

function PublicationContentWrapper({publication, user, publisher, isLiked, onLiked, isSubscribed, onSubscribe, onUnSubscribe}){
    const likesNumber = publication.likes ? publication.likes.length : 0;
    publisher = publisher || publication.publisher;
    const contentImageSrc = (publication.contents && publication.contents.length > 0 ) ? publication.contents[0].image : null;
    const publisherFullName = publisher.firstName + " " + publisher.name;

    const handleContentClick = function(){
        showModal(<Publication publication={publication} user={user} /> );
    }

    return <div className="publication-content-wrapper">
        
        { contentImageSrc ? <PublicationContent src={ contentImageSrc } onContentClick={ handleContentClick }/> : "" }

        <div className="publication-details-wrapper">     
            <div className="publication-details publication-details-name-and-likes">
                {/* #TODO : récupérer les bages : front + backend */}
                {/* <PublisherName badges={publication.publisher.badges}>{ publication.publisher.name }</PublisherName> */}
                <PublisherName 
                    user={ user } 
                    publisher={ publisher } 
                    badges={[]} 
                    isSubscribed={ isSubscribed } 
                    onSubscribe={ onSubscribe } 
                    onUnSubscribe={ onUnSubscribe }>
                        { publisherFullName }
                </PublisherName>
                <span className="publication-date" title={ "publiée "+ formatDateHour(publication.publicationDate).str }>{ formatDateHour(publication.publicationDate).full }</span>
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

function PublicationCommentsWrapper({comments, onNewCommentSubmitted, allowComment}){
    const [isCommenting, setIsCommenting ] = useState(false)
    const handleCommenting = function(){
        if(!allowComment)
        {
            alert("Veuillez vous connectez pour ajouter un commentaire.");
            return;
        }
        setIsCommenting(i => !isCommenting);
    }

    const handleCommentSubmit = function(text){
        onNewCommentSubmitted(text);
        setIsCommenting(i => false);
    }

    return <div className="publication-comments-wrapper">
        <div className="publication-comments">
        {
            comments.map( comment =>  <Comment comment={ comment } key={ cuniqid(comment.author.id) }/>)        
        }        
        </div>
        <div className="publication-comments-details">
            <CommentButton commented={ false } commentNumber={ comments.length } onCommenting={ handleCommenting }/>
            <ShareButton shared={ false } shareNumber={ 0 } />
            {
                (allowComment && isCommenting) ? <NewCommentField onNewCommentSubmitted={ handleCommentSubmit } /> : ""
            }
            
        </div>
    </div>
}

function NewCommentField({onNewCommentSubmitted}){
    const [text, setCommentText] = useState("")
    const handleCommentSubmit = function(){
        if(text.trim())
        {
            onNewCommentSubmitted(text);
        }
    }
    const handleChange = function (e){
        // console.log("New commentaire :", e.target.value);
        setCommentText(t => e.target.value);
    }

    return <div className="new-comment" valid={ (!!text).toString() }>
        <textarea name="new-comment" id="" value={ text } onChange={ handleChange }></textarea>
        <button className="new-comment-btn">
            <img src={submitCommentIcon} alt="" onClick={ handleCommentSubmit }/>
        </button>
    </div>
}

function CommentButton({commented, commentNumber, onCommenting}){
    const commentIcon = commented ? commentFiledIcon : commentLineIcon;
    return <div className="comment-btn-wrapper">
        <button className="comment-btn" onClick={ onCommenting }>
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
        <img src={ comment.author.profilePicture || defaultProfilePicture } alt={ comment.author.name } className="comment-author-image" />
        <div className="comment-author-name">
            { comment.author.name }
            { badges }
        </div>
        <div className="comment-publish-time" title={ comment.publishTime }>{ comment.publishTime }</div>
        <div className="comment-text">
            <div className="comment-beak"></div>
            <div> { comment.text.split('\n').map(c => (<div className="comment-line" key={ cuniqid(c) }>{c}</div>) ) } </div>
        </div>
    </div>
}

function UserBadge({name, icon}){
    return <img 
        className="badge comment-author-badge"
        src={ icon } 
        alt={ name }/>
}

function PublicationContent({src, onContentClick}){
    const content = <PublicationImage src={ src } />;
    return <div className="publication-content" onClick={ onContentClick }>
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

function PublisherName({user, publisher, badges, children, isSubscribed, onSubscribe, onUnSubscribe}){
    const badgeElts = (badges && badges.length > 0)? 
        badges.map(badge => <UserBadge name={ badge.name } icon={ badge.icon } key={ cuniqid(badge.name) }/>)
        : "";
    const subscribeButton = !isSubscribed ? 
        <button className="subscribe-btn" onClick={ onSubscribe } title="s'abonner"> s'abonner </button> :
        <button className="unsubscribe-btn" onClick={ onUnSubscribe } title="se desabonner">aboné(e)</button>
    

    const handleClick = async function(e){
        const updatedPublisher = await getUserInfo(publisher.id);
        gotoProfile({
            user: updatedPublisher, 
            viewer: await getAuthentifiedUserFromSession()
        })
    }
    
    return <div className="publication-publisher-name">
        <span onClick={ handleClick }> { children } </span>
        { badgeElts }
        { (user && user.id==publisher.id) ? "" : subscribeButton }
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
        const {name, value} = e.target;
        setPublication(p => ({...p, [name]: value}) );
    }

    const handleFileChange = function(e){  
        // file
        const file = e.target.files ? e.target.files[0] : null;
        if( file )
        {
            setPublication(p => ({...p, image: file}));
            // preview image
            publicationImg.current.src = URL.createObjectURL(file);
            return;
        }
        else
            publicationImg.current.src = "";
    }

    /** submit new publication */
    const handleClick = async function(){
        // console.log("New publication : ",publication);
        const res = await createNewPublication(publication, user.id);
        if(res.publication)
        {
            const newPublication = {...res.publication, publisher: user};
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