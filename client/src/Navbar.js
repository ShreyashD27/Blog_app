import { Link } from "react-router-dom";
import "./styles.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>My Blog</h1>
            <div className="nav-links">
                <Link to="/" className="nav-button">All Posts</Link>
                <Link to="/add" className="nav-button">Add Post</Link>
            </div>
        </nav>
    );
};

export default Navbar;
