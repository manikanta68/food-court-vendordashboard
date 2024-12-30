import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import "./index.css"

const Header = () => {
    const navigate = useNavigate();
    const username = Cookies.get("username")
    const handleProfileClick = () => {
        const token = Cookies.get("jwtToken"); 
        if (token) {
          navigate("/");
        } else {
          navigate("/login");
        }
    
      };
    
    return <header className="header">
        <div>
            <h1 className="vendor-heading">Vendor Dashboard</h1>
            <p className="vendor-head-description">Welcome to your multiplex management system</p>
        </div>
        <button onClick={handleProfileClick} className="vendor-profile"><p> {username ? username : "Manikanata"}  </p> <img className="profile-pic" src="https://res.cloudinary.com/djszohdjt/image/upload/v1735055325/lxes4l08hirxs6lbksyn.jpg" alt="profile-pic"/></button>
    </header>
}

export default Header