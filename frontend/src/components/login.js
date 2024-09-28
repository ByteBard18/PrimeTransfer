import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config.js';
import '../styles/login.css'; // Adjust path as needed
import { FaGoogle, FaFacebookF, FaLinkedin, FaGithub } from 'react-icons/fa';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms.js';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            localStorage.setItem("uid", user.uid);
            localStorage.setItem("token", user.token);
            console.log("User Id saved as:", localStorage.getItem("uid"));
            console.log("Access Token saved as:", localStorage.getItem("token"));
        }
    }, [user]);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleCredentials = (e) => {
        const { name, value } = e.target;
        setUserCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password);
            console.log(userCredential.user);
            navigate("/login"); // Navigate only after successful signup
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password);
            const token = await userCredential.user.getIdToken();
            setUser({ uid: userCredential.user.uid, token });
            navigate("/home"); // Navigate only after successful login
        } catch (error) {
            setError(error.message);
        }
    };

    const handlePasswordReset = async () => {
        const email = prompt('Please enter your Email');
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert('Email sent! Check your inbox for password reset instructions.');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className='main' style={{
            display: "flex",
            marginTop: "10vh",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div className={`login-container ${isSignUp ? 'sign-up-mode' : 'sign-in-mode'}`}>
                <div className="form-container sign-up">
                    <form onSubmit={handleSignup}>
                        <h1 style={{
                            color: "rgba(55, 174, 8, 0.725)"
                        }}>Create Account</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><FaGoogle /></a>
                            <a href="#" className="icon"><FaFacebookF /></a>
                            <a href="#" className="icon"><FaLinkedin /></a>
                            <a href="#" className="icon"><FaGithub /></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" required />
                        <input type="email" name="email" onChange={handleCredentials} placeholder="Email" required />
                        <input type="password" name="password" onChange={handleCredentials} placeholder="Password" required />
                        <button type="submit">Sign Up</button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>

                <div className="form-container sign-in">
                    <form onSubmit={handleLogin}>
                        <h1 style={{
                            color: "rgba(55, 174, 8, 0.725)"
                        }}>Sign in</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><FaGoogle /></a>
                            <a href="#" className="icon"><FaFacebookF /></a>
                            <a href="#" className="icon"><FaLinkedin /></a>
                            <a href="#" className="icon"><FaGithub /></a>
                        </div>
                        <span>or use your email and password</span>
                        <input name="email" type="email" onChange={handleCredentials} placeholder="Email" required />
                        <input name="password" type="password" onChange={handleCredentials} placeholder="Password" required />
                        <a href="#" onClick={handlePasswordReset} className='forgotpassword'>Forgot Your Password?</a>
                        <button type="submit">Sign In</button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-right">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of the site's features</p>
                            <button className="hidden" onClick={toggleForm}>Sign Up</button>
                        </div>
                        <div className="toggle-panel toggle-left">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of the site's features</p>
                            <button className="hidden" onClick={toggleForm}>Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
