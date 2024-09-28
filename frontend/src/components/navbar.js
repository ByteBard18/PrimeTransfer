import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUpload,
  FaTrashAlt,
  FaInfoCircle,
  FaLifeRing,
  FaQuestionCircle,
  FaCommentDots,
  FaDownload,
  FaSignOutAlt
} from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSupportClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo" onClick={() => navigate("/home")}>
          PrimeTransfer
        </h2>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate("/home")}>
          <FaHome /> Home
        </button>
        <button onClick={() => navigate("/upload")}>
          <FaUpload /> Upload
        </button>
        <button onClick={() => navigate("/download")}>
          <FaDownload /> Download
        </button>
        <button onClick={() => navigate("/about-us")}>
          <FaInfoCircle /> About Us
        </button>
        <button onClick={() => navigate("/profile")}>
          <FaUser />
        </button>
        <button onClick={()=>{
          navigate("/login")
        }}>
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
