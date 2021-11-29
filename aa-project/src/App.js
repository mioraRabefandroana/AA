import logo from './logo.svg';
import './App.css';
import {Home} from './home/Home';
import ReactDOM from 'react-dom';
import { Explore } from './explore/Explore';
import { useEffect } from 'react';
import { initApiConnection } from './Utilities';

export const root = document.getElementById('root');

// # comment & share button icon color : #ffde00

function App() {
   
  useEffect(() => {
      initApiConnection();    
    }, [])

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


/**
 * #TODO : fit explore page
 * ~#DEPRECATED
 */
function fitContent(){
  window.addEventListener('load', function(){
    const contentElt = document.querySelector(".content");
    if(!contentElt)
      return;
    const height = document.body.clientHeight - contentElt.offsetTop;
    contentElt.style.maxHeight = height;
    console.log('fit');
  });  
};


export default App;
