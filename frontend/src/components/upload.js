import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import '../styles/upload.css';
import { MdOutlineDeleteOutline, MdOutlineDriveFolderUpload } from "react-icons/md";
import { useRecoilValue } from 'recoil';
import { token_Id } from '../recoil/atoms.js';
import axios from 'axios';

function Upload() {
    const { uid, token } = useRecoilValue(token_Id);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        file: null,
        user_id: uid
    });

    const [uploadedCards, setUploadedCards] = useState([]);

    const fetchUploadedDocs = async () => {
        try {
            console.log("Fetching uploaded docs...");
            const response = await axios.get(`http://localhost:8000/getDocsByUser?user_id=${uid}`, {
                headers: {
                    "x_access_token": token
                }
            });
            setUploadedCards(response.data.map(doc => ({
                id: doc.doc_id,
                title: doc.title,
                author: doc.author,
                description: doc.description,
                size: doc.size ? doc.size : 'Unknown',
            })));
        } catch (error) {
            console.error('Error fetching uploaded files:', error.response?.data);
        }
    };

    useEffect(() => {
        fetchUploadedDocs(); // Call it once when the component mounts
    }, [uid]); // Runs when the component mounts or uid changes

    const handleDelete = async (doc_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this document?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:8000/deleteDoc/${doc_id}/`, {
                    headers: {
                        "x_access_token": token
                    }
                });
                console.log("File Deleted Successfully: ", response.data);
                setUploadedCards(uploadedCards.filter((card) => card.id !== doc_id)); // Filter correctly
                await fetchUploadedDocs();
            } catch (error) {
                console.log("Error deleting the file: ", error.response?.data);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('file', formData.file);
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('desc', formData.description);
        data.append('user_id', formData.user_id);
        data.append('size', formData.file.size);

        try {
            const response = await axios.post('http://localhost:8000/postDocs/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);

            // Fetch the documents again to refresh the list
            await fetchUploadedDocs();
            alert("File uploaded successfully!"); // Alert after successful upload
        } catch (error) {
            console.error('Error uploading file:', error.response?.data);
        }

        // Reset form
        setFormData({
            title: '',
            author: '',
            description: '',
            file: null,
            user_id: uid
        });
    };

    const getSignedUrl = async (doc_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/presignedUrl/${doc_id}.pdf/`);
            return response.data.url; // Adjust based on your response structure
        } catch (err) {
            setError("Failed to fetch signed URL");
            throw err; // Re-throw to handle in the calling function
        }
    };

    const shareToWhatsApp = async (card) => {
        const confirmShare = window.confirm("Do you want to share this document on WhatsApp?");
        if (confirmShare) {
            const url = await getSignedUrl(card.id); // Use card.id instead of card.doc_id
            const message = `Check out this document:\n\nTitle: ${card.title}\nAuthor: ${card.author}\nDescription: ${card.description}\nSize: ${card.size}\nUrl: ${url}`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <>
            <Navbar />
            <div className="upload-page">
                <div className="upload-container">
                    <div className="upload-section">
                        <h1>Upload Your File</h1>
                        <form onSubmit={handleSubmit}>
                            <label>File Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />

                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            <label>Choose File:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                            <div style={{ textAlign: 'center' }}>
                                <button type="submit">Upload <MdOutlineDriveFolderUpload /></button>
                            </div>
                        </form>
                    </div>
                    <div className="cards-section">
                        <h2>Uploaded Files</h2>
                        <div className="cards-grid">
                            {uploadedCards.map((card) => (
                                <div key={card.id} className="upload-card">
                                    <h3>{card.title}</h3>
                                    <p>Author: {card.author}</p>
                                    <p>Description: {card.description}</p>
                                    <p>Size: {card.size} bytes</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={() => shareToWhatsApp(card)}>Share</button>
                                        <button onClick={() => handleDelete(card.id)}>Delete <MdOutlineDeleteOutline /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Upload;