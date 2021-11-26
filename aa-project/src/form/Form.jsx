import './Form.css'


export function Button({icon, children, onClick, className}){
    const btnClassName = "btn "+className;
    const btnIcon = icon ? <img src={icon} alt={ children } /> : "";
    return <button className={ btnClassName } onClick={ onClick } title={ children }>
        { btnIcon }
        { children }
    </button>
}

export function FloatButton({icon, title, onClick, className, number}){
    const btnClassName = "float-btn "+className;
    const btnIcon = icon ? <img src={icon} alt={ title } /> : "";
    const info = number ? <div className="float-info">{ number }</div> : "";
    const active = !!number;   
    return <button className={ btnClassName } onClick={ onClick } title={ title } active={ ""+active }>
        { info }
        { btnIcon }
    </button>
}


export function SearchBar({placeholder, className, id}){
    const placeholderText = placeholder || "search";
    const searchBarClassName = "search-bar "+ (className || "");
    

    return <div className={searchBarClassName} id={id}>
        {/* <img src="" alt="search-icon" /> */}
        <input 
        className="search-input"
        type="text" 
        placeholder={ placeholderText }/>
    </div>
    
}