import './Form.css'


export function Button({icon, children}){
    return <button className="btn btn-home-explore">
        {icon ? <img src={icon} alt="explorer" /> : "" }
        {children}
    </button>
}