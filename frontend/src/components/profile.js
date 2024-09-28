import React, { useState, useEffect } from 'react';
import { getAuth, updatePassword, deleteUser, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from './navbar';
import Footer from './footer';
import { useNavigate } from 'react-router-dom'; 
import '../styles/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document exists!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, db]);

  const handlePasswordChange = async () => {
    if (newPassword) {
      try {
        await updatePassword(user, newPassword);
        alert('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Error updating password. Please try again.');
      }
    } else {
      alert('Please enter a new password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUser(user);
        alert('Account deleted successfully');
        navigate('/login'); 
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully');
      navigate('/login'); 
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user ? (
          <div className="profile-form">
            <form>
              <label>
                Email:
                <input type="text" value={userData.email || user.email} readOnly />
              </label>
              <label>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </label>
            </form>

            <div className="button-group">
              <button className="btn-change" onClick={handlePasswordChange}>Change Password</button>
              <button className="btn-delete" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <p>No user is signed in</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Profile;
