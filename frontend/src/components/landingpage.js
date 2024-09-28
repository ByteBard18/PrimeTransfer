import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import heroImage from "../assets/hero.jpg";
import uploadImage from "../assets/upload.jpg"; // Add images for features
import searchImage from "../assets/search.jpg";
import manageImage from "../assets/delete.jpg";

function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home/");
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1>Welcome to PrimeTransfer</h1>
        <p>Upload, Share, and Download Files Effortlessly</p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </header>
      <img src={heroImage} alt="Hero" className="hero-image" />

      <section className="features">
        <div className="feature">
          <img src={uploadImage} alt="Upload Files" />
          <h2>Upload Your Files</h2>
          <p>
            Share your documents publicly with others. Your files will be stored
            securely in our database.
          </p>
        </div>
        <div className="feature">
          <img src={searchImage} alt="Search Files" />
          <h2>Search & Download</h2>
          <p>
            Find and download any document easily by searching through our
            extensive library.
          </p>
        </div>
        <div className="feature">
          <img src={manageImage} alt="Manage Files" />
          <h2>Manage Your Files</h2>
          <p>Delete your files anytime you want with just a few clicks.</p>
        </div>
      </section>
      <section className="statistics">
        <div className="stat">
          <h3>10K+</h3>
          <p>Files Uploaded</p>
        </div>
        <div className="stat">
          <h3>5K+</h3>
          <p>Users Registered</p>
        </div>
        <div className="stat">
          <h3>20K+</h3>
          <p>Downloads</p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 PrimeTransfer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
