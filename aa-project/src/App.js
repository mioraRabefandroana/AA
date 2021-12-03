import logo from './logo.svg';
import './App.css';
import {Home} from './home/Home';
import ReactDOM from 'react-dom';
import { Explore } from './explore/Explore';
import { useEffect } from 'react';
import { initApiConnection } from './Utilities';
import { CURRENT_USER } from './UserManager';

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
export function gotoExplore()
{
    ReactDOM.render(<Explore/>, root);
}


export default App;
