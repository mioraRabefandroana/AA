import logo from './logo.svg';
import './App.css';
import {Home} from './home/Home';
import ReactDOM from 'react-dom';
import { Explore } from './explore/Explore';
import { useEffect } from 'react';
import { initApiConnection } from './Utilities';
import { CURRENT_USER } from './UserManager';
import { Profile } from './explore/Profile';;

export const root = document.getElementById('root');

// # comment & share button icon color : #ffde00

function App() { 
    return (
        <Home/>
    );
}

  
export function gotoHome()
{
    ReactDOM.render(<Home/>, root)
}
export function gotoExplore({user})
{
    ReactDOM.render(<Explore user={ user }/>, root);
}
export function gotoProfile({children, activeMenu, user}){
    ReactDOM.render(<Profile activeMenu={ activeMenu } user={ user }>{ children }</Profile> , root);
}

export function gotoLogin(){
    // TODO: Afficher le login form en modal
    // ReactDOM.render(<Profile activeMenu={ activeMenu }>{ children }</Profile>, root);
    gotoHome();
}

export default App;
