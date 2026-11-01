import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("techfestToken");

  function logout() {
    localStorage.removeItem("techfestToken");
    localStorage.removeItem("techfestUser");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2>TechFest 2026</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/register">Register</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>
        {!token && <Link to="/signup">Sign Up</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <button onClick={logout}>Logout</button>}
      </div>
      <button onClick={toggleTheme}>
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
    </nav>
  );
}

export default Navbar;
