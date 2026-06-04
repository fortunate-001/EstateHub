import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const mobileMenuRef = useRef(null);
  const hamburgerBtnRef = useRef(null);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [mobileMenuOpen]);

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
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Block only horizontal swipe gestures while allowing vertical scroll
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Only prevent if it's a horizontal swipe and menu is closed
      if (!mobileMenuOpen) {
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        
        // If horizontal swipe (more horizontal than vertical) and significant
        if (deltaX > deltaY && deltaX > 30) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Only add listeners on mobile devices
    if (window.innerWidth <= 768) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

          <button
            ref={hamburgerBtnRef}
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={mobileMenuOpen ? "bx bx-x" : "bx bx-menu"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Click to close */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      {/* Mobile Menu - ONLY opens via hamburger click */}
      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
      >
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <span>EstateHub</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="mobile-profile-section">
          {user ? (
            <div className="mobile-user-card">
              <div className="user-avatar">
                <i className="bx bxs-user-circle"></i>
              </div>
              <div className="user-welcome">
                <p className="welcome-text">{getGreeting()}</p>
                <h3 className="user-name-mobile">{getUserName()}</h3>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="mobile-guest-card">
              <div className="guest-avatar">
                <i className="bx bx-user-circle"></i>
              </div>
              <div className="guest-info">
                <h3>Welcome Guest</h3>
                <p>Sign in to access your account</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mobile-nav-items">
          <div className="mobile-nav-group">
            <div className="nav-group-title">
              <i className="bx bx-navigation"></i>
              <span>Main Menu</span>
            </div>
            <div className="mobile-nav-link" onClick={() => handleNavigation("/")}>
              <i className="bx bx-home"></i>
              <span>Home</span>
              <i className="bx bx-chevron-right"></i>
            </div>
            <div className="mobile-nav-link" onClick={() => handleNavigation("/properties")}>
              <i className="bx bx-building"></i>
              <span>Properties</span>
              <i className="bx bx-chevron-right"></i>
            </div>
            <div className="mobile-nav-link" onClick={() => handleNavigation("/contact")}>
              <i className="bx bx-envelope"></i>
              <span>Contact</span>
              <i className="bx bx-chevron-right"></i>
            </div>
            {user && isAdmin && (
              <div className="mobile-nav-link" onClick={() => handleNavigation("/admin")}>
                <i className="bx bx-dashboard"></i>
                <span>Admin Dashboard</span>
                <i className="bx bx-chevron-right"></i>
              </div>
            )}
          </div>

          {user && (
            <div className="mobile-nav-group">
              <div className="nav-group-title">
                <i className="bx bx-user"></i>
                <span>Account</span>
              </div>
              <div className="mobile-nav-link" onClick={() => handleNavigation("/profile")}>
                <i className="bx bx-user-circle"></i>
                <span>My Profile</span>
                <i className="bx bx-chevron-right"></i>
              </div>
              <div className="mobile-nav-link" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                <span>Logout</span>
                <i className="bx bx-chevron-right"></i>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle & Footer */}
        <div className="mobile-menu-footer">
          <div className="mobile-theme-toggle" onClick={toggleTheme}>
            <i className={darkMode ? "bx bx-sun" : "bx bx-moon"}></i>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          
          {!user && (
            <div className="mobile-auth-buttons">
              <button className="mobile-auth-login" onClick={() => handleNavigation("/login")}>
                Login
              </button>
              <button className="mobile-auth-register" onClick={() => handleNavigation("/register")}>
                Register
              </button>
            </div>
          )}
          
          <div className="mobile-footer-text">
            <p>© 2024 EstateHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;