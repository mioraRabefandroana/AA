import './Form.css'


export function Button({icon, children, onClick, className}){
    const btnClassName = "btn "+className;
    return <button className={ btnClassName } onClick={ onClick }>
        { icon ? <img src={icon} alt="explorer" /> : "" }
        { children }
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