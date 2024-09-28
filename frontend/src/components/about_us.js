import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import '../styles/about.css';

function About() {
    return (
        <div className='about-c'>
        
            <Navbar />
            <div className="about-container">
                <h1>About Prime Transfer</h1>
                <p>
                    Prime Transfer is a cutting-edge platform designed for effortless file sharing and management. 
                    Whether you're uploading, sharing, or downloading files, we provide a seamless experience with our secure and reliable system.
                </p>
                
                <h2>Our Mission</h2>
                <p>
                    Our mission is to make file management easy and accessible for everyone. 
                    We believe in simplifying the process of file transfers, ensuring privacy and security while offering robust features like public document sharing, document searches, and the ability to delete your uploads.
                </p>
                
                <h2>Why Choose Prime Transfer?</h2>
                <ul>
                    <li>Fast and secure file uploads and downloads</li>
                    <li>User-friendly interface</li>
                    <li>Public sharing of files with a searchable database</li>
                    <li>Completely free and easy to use</li>
                </ul>
                
                <h2>Contact Us</h2>
                <p>
                    If you have any questions, feel free to reach out at <strong>support@primetransfer.com</strong>. 
                    We’re here to assist you with all your file management needs.
                </p>
            </div>
            <Footer />
        </div>
    );
}

export default About;
