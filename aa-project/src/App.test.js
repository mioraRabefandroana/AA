import {render, screen, fireEvent} from '@testing-library/react'
// import {act} from '@testing-library/react-hooks'
import App from './App';
import { Explore, ExploreHeader, ExploreRightMenu } from './explore/Explore';
import { getExplorePublications } from './explore/ExploreData';
import { LikeButton, Publication, PublicationCommentsWrapper, PublisherName } from './explore/Publication';
import { isPublicationLikedByUser } from './explore/PulicationManager';
import { artistTest, getUserTest, notValidUser, validUser } from './TestData';
import { getAuthentifiedUserFromSession, getUserInfo, isUserSubscribed, login, logout } from './UserManager';
import { cuniqid } from './Utilities'

test("Test pour la page d'accueil", () => {
  render(<App />);
  let exploreBtn = screen.findByText(/EXPLORER/i);
  expect(exploreBtn).not.toBeNull();
});

describe("Test de connexion", async () => {
    /**
     * Test avec un utilisateur pas valide
     */
    let notValidUsers = getUserTest()
    for(let u of notValidUsers)
    {
        it("tentative de connexion", async ()=>{
            render(<App />);
            let inputUsername = document.querySelector("#login-user input")
            let inputPassword = document.querySelector("#login-password input")
            fireEvent.change(
                inputUsername, 
                {target: {value: u.username}}
            )
            fireEvent.change(
                inputPassword, 
                {target: {value: u.password}}
            )

            let loginBtn = document.querySelector(".login-connexion-btn") 
            
            await fireEvent.click(loginBtn);

            if(!u.success){
                let text = "Echec d'authentification";
                let authErrorMsgElt = await screen.findByText( new RegExp(text) );
                expect(authErrorMsgElt).not.toBeNull();
            }
        })
    }
});


test("Test Explore [non connecté]", async () => {
    render(<Explore />);
    let explorePage = document.querySelector("#explore");
    expect(explorePage).not.toBeNull();
    let connexionBtn = document.querySelector(".nav-connexion-btn");
    expect(connexionBtn).not.toBeNull();
});



test("Test d'authentification [token] | deconnexion", async () => {
    // pas encore authentifier
    let user = await getAuthentifiedUserFromSession()
    expect( await getAuthentifiedUserFromSession() ).toBeNull();

    let token = await login(validUser.username, validUser.password);
    expect(token).not.toBeNull();

    // authentifié
    user = await getAuthentifiedUserFromSession();
    expect( user ).not.toBeNull();

    // deconnecté
    await logout();
    user = await getAuthentifiedUserFromSession();
    expect( user ).toBeNull();

});



test("Test En-tête", async () => {

    // non authentifié : bouton se connecter
    render( <ExploreHeader />  );
    let loginBtn = await screen.findByText(/Se connecter/i);
    expect(loginBtn).not.toBeNull();

    // authentification
    await login(validUser.username, validUser.password);
    let user = await getAuthentifiedUserFromSession();

    // après authentification : nom d'utilisateur
    render( <ExploreHeader user={user}/>  );
    let infoBtn = document.querySelector("[title="+validUser.username+"]");
    expect(infoBtn).not.toBeNull();  

    await logout();  
})


test("Test Menu de droite [boutons] - FAN", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);

    // se conneter en tant que fan : bouton message et notification seulement
    await login(validUser.username, validUser.password);
    let user = await getAuthentifiedUserFromSession();
    
    render( <ExploreRightMenu user={user} notifications={ ["test"] } messages={ ["test"] } onNewPublicationCreated={ ()=>{} } /> );
    let btns = document.querySelectorAll(".message-btn, .notification-btn, .new-btn");
    expect(btns.length).toBe(2)

    await logout();
})

test("Test Menu de droite [boutons] - ARTIST", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);

    const mockNewPublication = jest.fn();
    expect(mockNewPublication.mock.calls.length).toBe(0);

    // se connecter en tant qu'artiste : bouton ajouter en plus
    await login(artistTest.username, artistTest.password);
    let artist = await getAuthentifiedUserFromSession();       
    render( <ExploreRightMenu user={artist} notifications={ ["test"] } messages={ ["test"] } onNewPublicationCreated={ mockNewPublication } /> );
    let btns = document.querySelectorAll(".message-btn, .notification-btn, .new-btn");
    expect(btns.length).toBe(3)

    await logout();
})


test("Test Publication", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);

    let publications = await getExplorePublications({})
    expect(publications.length > 0).toBe(true);
    let publication = publications[0];

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const mockSubscribe = jest.fn();
    const mockUnSubscribe = jest.fn();

    render( 
        <Publication 
            publication={ publication } 
            // user={ user } 
            onSubscribe={ mockSubscribe }
            onUnSubscribe={ mockUnSubscribe }/> 
    )
    
    let publicationText = document.querySelectorAll(".publication-text");
    expect(publicationText).not.toBeNull();

    let subscribeBtn = document.querySelector(".subscribe-btn");
    expect(subscribeBtn).not.toBeNull();

    let btn = document.querySelector(".subscribe-btn, .unsubscribe-btn");
    expect(btn).not.toBeNull();    

    await logout();
})


test("Test S'abonner/Se desabonner", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);
    await login(validUser.username, validUser.password);
    let user = await getAuthentifiedUserFromSession();  
    expect(user).not.toBeNull()

    let publications = await getExplorePublications({})
    expect(publications.length > 0).toBe(true);
    let publication = publications[0];

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const mockSubscribe = jest.fn(p=>{});
    const mockUnSubscribe = jest.fn(p=>{});

    const isSubscribed = isUserSubscribed(user, publication.publisher);
    render( 
        <PublisherName
            user={ user } 
            publisher={ publication.publisher } 
            badges={[]} 
            isSubscribed={ isSubscribed } 
            onSubscribe={ mockSubscribe } 
            onUnSubscribe={ mockUnSubscribe }>
                { publication.publisher.name }
        </PublisherName>
    )
    
    let text = await screen.findByText(publication.publisher.name);
    expect(text).not.toBeNull();

    if(!isSubscribed){
        let subscribeBtn = document.querySelector(".subscribe-btn");
        expect(subscribeBtn).not.toBeNull();
        fireEvent.click(subscribeBtn);
        expect( mockSubscribe.mock.calls.length ).toBe(1)
    }
    else{
        let btn = document.querySelector(".unsubscribe-btn");
        expect(btn).not.toBeNull();
        fireEvent.click(btn);
        expect( mockUnSubscribe.mock.calls.length ).toBe(1)
    }

    await logout();
})

test("Test Liker/Unliker", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);
    await login(validUser.username, validUser.password);
    let user = await getAuthentifiedUserFromSession();  
    expect(user).not.toBeNull()

    let publications = await getExplorePublications({})
    expect(publications.length > 0).toBe(true);
    let publication = publications[0];

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const mockLike = jest.fn();

    const isLiked = isPublicationLikedByUser(publication, user);
    render( 
        <LikeButton isLiked={ isLiked } onLiked={ mockLike }/>
    )
    
    
    let btn = document.querySelector(".like-btn");
    expect(btn).not.toBeNull();
    expect( mockLike.mock.calls.length ).toBe(0)
    fireEvent.click(btn);
    expect( mockLike.mock.calls.length ).toBe(1)
    await logout();
})

test("Test Comment", async () => {    
    await logout();
    expect(await getAuthentifiedUserFromSession() ).toBe(null);
    await login(validUser.username, validUser.password);
    let user = await getAuthentifiedUserFromSession();  
    expect(user).not.toBeNull()

    let publications = await getExplorePublications({})
    expect(publications.length > 0).toBe(true);
    let publication = publications[0];

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const mockComment = jest.fn(text=>{});

    render( 
        <PublicationCommentsWrapper comments={ [] } onNewCommentSubmitted={ mockComment } allowComment={ true } />
    )
    
    
    let btn = document.querySelector(".comment-btn");
    fireEvent.click(btn);
    let inputComment = document.querySelector("[name=new-comment]");
    let newCommentBtn = document.querySelector(".new-comment-btn");
    expect(inputComment).not.toBeNull()
    expect(newCommentBtn).not.toBeNull()
    
    let text  = "test-commentaire";
    fireEvent.change(
        inputComment, 
        {target: {value: text}}
    )

    expect( mockComment.mock.calls.length ).toBe(0)
    fireEvent.click(newCommentBtn);
    expect( mockComment.mock.calls.length ).toBe(1)

    await logout();
})


