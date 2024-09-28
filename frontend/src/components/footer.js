import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram,FaHome, FaDiscord, FaUser, FaUpload, FaDownload } from 'react-icons/fa';
import '../styles/footer.css';

function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section website-info">
                    <h1 className="footer-logo">PrimeTransfer</h1>
                </div>
                <div className="footer-section links-section">
                    <div className="footer-column">
                        <h4>Quick Links</h4>
                        <ul>
                            <li onClick={() => navigate('/home')}><FaHome /> Home</li>
                            <li onClick={() => navigate('/profile')}><FaUser /> Profile</li>
                            <li onClick={() => navigate('/upload')}><FaUpload /> Uploads</li>
                            <li onClick={() => navigate('/downloads')}><FaDownload /> Downloads</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li onClick={() => navigate('/about-us')}>About</li>
                            <li onClick={() => navigate('/contact')}>Contact</li>
                            <li onClick={() => navigate('/support')}>Support</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Social Media</h4>
                        <ul>
                            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a></li>
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a></li>
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a></li>
                            <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer"><FaDiscord /> Discord</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{textAlign:'center'}} className="footer-section website-slogan">
                    <h1>
                        "Share your files with the world, effortlessly and securely with PrimeTransfer."
                    </h1>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
