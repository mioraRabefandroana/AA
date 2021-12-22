import './Form.css';
import { useEffect, useState } from 'react';
import ReactDOM from "react-dom";


export function Button({icon, children, onClick, id, className}){
    const btnClassName = "btn "+className;
    const btnIcon = icon ? <img src={icon} alt={ children } /> : "";

    const handleClick = function(e){
        e.preventDefault();
        onClick();
    }

    return <button id={ id } className={ btnClassName } onClick={ handleClick } title={ children }>
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

export function Field({type="text", label, id, name, onChange, readOnly=false, value, className}){
    const inputId = id + "-value";
    
    const input = (!readOnly) ? 
        <input id={ inputId } type={ type } className="field-input field-value" name={ name } value={ value } onChange={ onChange }/> :
        <div className="field-value" title={ value }>{ value }</div>

    className = "field " + (className ? className : "");
    return <div className={ className } id={ id }>
        <label htmlFor={ inputId } className="field-label">{ label }</label>
        { input }        
    </div>
}

export function TextAreaField({label, id, name, onChange, readOnly=false, value, className}){

    const inputId = id + "-value";
    const input = (!readOnly) ? 
        <textarea id={ inputId } name={ name } value={ value } onChange={ onChange } className="field-input" cols="30" rows="10"></textarea> :
        <div className="field-value" title={ value }>{ value ? value : "-" }</div>

    className = "field " + (className ? className : "");
    return <div className={ className } id={ id }>
        <label htmlFor={ inputId } className="field-label">{ label }</label>
        { input }  
   </div>    
}

export function Modal({children}){

    return  <div className="modal">
        <div className="modal-close-btn" onClick={ hideModal }>x</div>
        { children }
    </div>
}

export function showModal(modal){
    // debugger;
    const modalWrapper = document.getElementById("modal-wrapper");
    modalWrapper.classList.add("active-modal");
    ReactDOM.render(<Modal visible={ true }>{ modal }</Modal>, modalWrapper);
}

export function closeModal(){
    const modalWrapper = document.getElementById("modal-wrapper");
    modalWrapper.classList.remove("active-modal");
    ReactDOM.render(<></>, modalWrapper);
}

export function hideModal(){
    closeModal();
}