import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminEmails = ["admin@example.com", "fortunateolawale7@gmail.com"];
      if (currentUser && adminEmails.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setShowDropdown(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo" onClick={() => handleNavigation("/")}>
          EstateHub
        </h1>

        {/* Desktop Navigation */}
        <ul className="nav-links-desktop">
          <li onClick={() => handleNavigation("/")}>Home</li>
          <li onClick={() => handleNavigation("/properties")}>Properties</li>
          <li onClick={() => handleNavigation("/contact")}>Contact</li>
          {user && isAdmin && (
            <li onClick={() => handleNavigation("/admin")}>Admin</li>
          )}
        </ul>

        {/* Desktop Right Section */}
        <div className="nav-right">
          {/* User Icon with Dropdown - Contains Dark Mode */}
          <div className="user-icon-container">
            <i
              className={user ? "bx bxs-user-check" : "bx bx-user"}
              onClick={() => setShowDropdown(!showDropdown)}
            ></i>

            {showDropdown && (
              <div className="dropdown-menu">
                {!user ? (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => handleNavigation("/login")}
                    >
                      <i className="bx bx-log-in"></i>
                      <span>Login</span>
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleNavigation("/register")}
                    >
                      <i className="bx bx-user-plus"></i>
                      <span>Register</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item" onClick={toggleTheme}>
                      <i className={darkMode ? "bx bx-sun" : "bx bx-moon"}></i>
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-user-info">
                      <i className="bx bx-user-circle"></i>
                      <div className="user-greeting">
                        <div className="greeting-text">{getGreeting()},</div>
                        <div className="user-name">{getUserName()}!</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleNavigation("/profile")}
                    >
                      <i className="bx bx-user"></i>
                      <span>Profile</span>
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <i className="bx bx-log-out"></i>
                      <span>Logout</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item" onClick={toggleTheme}>
                      <i className={darkMode ? "bx bx-sun" : "bx bx-moon"}></i>
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={mobileMenuOpen ? "bx bx-x" : "bx bx-menu"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Stylish Full Screen */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-content">
          <div className="mobile-user-section">
            {user ? (
              <>
                <i className="bx bxs-user-circle"></i>
                <div className="mobile-user-info">
                  <h3>{getUserName()}</h3>
                  <p>{user.email}</p>
                </div>
              </>
            ) : (
              <>
                <i className="bx bx-user-circle"></i>
                <div className="mobile-user-info">
                  <h3>Welcome Guest</h3>
                  <p>Login or Register to continue</p>
                </div>
              </>
            )}
          </div>

          <div className="mobile-nav-links">
            <div
              className="mobile-nav-item"
              onClick={() => handleNavigation("/")}
            >
              <i className="bx bx-home"></i>
              <span>Home</span>
              <i className="bx bx-right-arrow-alt arrow"></i>
            </div>
            <div
              className="mobile-nav-item"
              onClick={() => handleNavigation("/properties")}
            >
              <i className="bx bx-building"></i>
              <span>Properties</span>
              <i className="bx bx-right-arrow-alt arrow"></i>
            </div>
            <div
              className="mobile-nav-item"
              onClick={() => handleNavigation("/contact")}
            >
              <i className="bx bx-phone"></i>
              <span>Contact</span>
              <i className="bx bx-right-arrow-alt arrow"></i>
            </div>
            {user && isAdmin && (
              <div
                className="mobile-nav-item"
                onClick={() => handleNavigation("/admin")}
              >
                <i className="bx bx-dashboard"></i>
                <span>Admin Dashboard</span>
                <i className="bx bx-right-arrow-alt arrow"></i>
              </div>
            )}
          </div>

          <div className="mobile-divider"></div>

          {/* Dark Mode in Mobile Menu */}
          <div className="mobile-nav-item" onClick={toggleTheme}>
            <i className={darkMode ? "bx bx-sun" : "bx bx-moon"}></i>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            <i className="bx bx-right-arrow-alt arrow"></i>
          </div>

          {!user ? (
            <div className="mobile-auth-buttons">
              <button
                className="mobile-login-btn"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </button>
              <button
                className="mobile-register-btn"
                onClick={() => handleNavigation("/register")}
              >
                Register
              </button>
            </div>
          ) : (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <i className="bx bx-log-out"></i>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
