
import "./index.css"

const Header = () => {
    return <header className="header">
        <div>
            <h1 className="vendor-heading">Vendor Dashboard</h1>
            <p className="vendor-head-description">Welcome to your multiplex management system</p>
        </div>
        <div className="vendor-profile"><p>Manikanata</p> <img className="profile-pic" src="https://res.cloudinary.com/djszohdjt/image/upload/v1735055325/lxes4l08hirxs6lbksyn.jpg" alt="profile-pic"/></div>
    </header>
}

export default Header