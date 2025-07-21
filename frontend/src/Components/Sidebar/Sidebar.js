import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiBell,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import "./Sidebar.css";

const links = [
  { label: "Personal Info", icon: <FiUser />, path: "/personal-info" },
  { label: "My Orders", icon: <FiPackage />, path: "/dashboard" },
  { label: "My Wishlist", icon: <FiHeart />, path: "/wishlistpage" },
  { label: "Notification", icon: <FiBell />, path: "/notifications" },
  { label: "Sign Out", icon: <FiLogOut />, path: "/logout" },
];

export default function Sidebar({ onMyAccountClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1127) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signup");
    window.location.reload();
  };

  const handleClick = (label, path) => {
    if (label === "Sign Out") {
      setShowConfirm(true);
    } else {
      navigate(path);
      if (windowWidth < 1127) setMobileSidebarOpen(false);
    }
  };

  const activeLink = links.find((link) => location.pathname === link.path);
  const activeLabel = activeLink?.label || "My Orders";

  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        <div className="breadcrumb-wrapper">
          <Link to="/home" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-divider">&gt;</span>
          <span className="breadcrumb-link clickable" onClick={onMyAccountClick}>My Account</span>
          <span className="breadcrumb-divider">&gt;</span>
          <span className="breadcrumb-link clickable" onClick={() => navigate(0)}>
            {activeLabel}
          </span>
        </div>

        <h3>Hello {username || "User"},</h3>
        <p className="subtitle">Welcome to your account</p>
      </div>

      <div className="nav-box">
        <ul className="nav-links">
          {links.map(({ label, icon, path }) => (
            <li key={label} className={location.pathname === path ? "active" : ""}>
              <button className="sidebar-btn" onClick={() => handleClick(label, path)}>
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p className="popup-message">Are you sure you want to sign out?</p>
            <div className="popup-buttons">
              <button className="btn-warning" onClick={signOut}>Yes</button>
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {windowWidth >= 1127 && <aside className="sidebar">{SidebarContent()}</aside>}

      {/* Mobile Toggle Button */}
      {windowWidth < 1127 && (
        <div
          className="sidebar-toggle"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
          title={isMobileSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        />
      )}

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMobileSidebarOpen(false)}>
          <FiX size={24} />
        </button>
        {SidebarContent()}
      </div>
    </>
  );
}
