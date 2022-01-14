import {render, screen, fireEvent} from '@testing-library/react'
import App from './App';
import { getUserTest, notValidUser, validUser } from './TestData';

test("Test pour la page d'accueil", () => {
  render(<App />);
  let exploreBtn = screen.findByText(/EXPLORER/i);
  expect(exploreBtn).not.toBeNull();

//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
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

            console.log([inputUsername.value, inputPassword.value]);
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


