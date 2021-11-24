import logo from './logo.svg';
import './App.css';
import {Home} from './home/Home';
import ReactDOM from 'react-dom';
import { Explore } from './explore/Explore';

export const root = document.getElementById('root');

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
    ReactDOM.render(<Explore/>, root)
}


export default App;
