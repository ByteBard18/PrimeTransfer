import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import "../styles/download.css";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { token_Id } from '../recoil/atoms';

function Download() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uid } = useRecoilValue(token_Id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getUserDownloads/${uid}`);
        setCardData(response.data); // Set card data directly
      } catch (err) {
        setError("Failed to fetch downloads");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter cards based on search term
  const filteredCards = cardData.filter((item) =>
    item.document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
      try {
        const url = await getSignedUrl(card.doc_id);
        const message = `Check out this document:\n\nTitle: ${card.title}\nAuthor: ${card.author}\nDescription: ${card.description}\nSize: ${card.size}\nUrl: ${url}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.error("Error sharing to WhatsApp:", err);
      }
    }
  };

  const handleDownload = async (doc_id) => {
    const confirmDownload = window.confirm("Do you want to download this document?");
    if (confirmDownload) {
      try {
        const response = await axios.get(`http://localhost:8000/downloadDoc/${doc_id}.pdf/${uid}`, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${doc_id}.pdf`); // You can adjust the file name as needed
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up
        alert("Download started!"); // Alert after download action
      } catch (err) {
        setError("Failed to download file");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="downloads-section">
        {/* Search Bar Section */}
        <div className="downloads-search-section">
          <div className="downloads-search-container">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="downloads-cards-section">
          {filteredCards.map((item) => (
            <div key={item.document.doc_id} className="downloads-card">
              <h3>{item.document.title}</h3>
              <p>{item.document.author}</p>
              <p>{item.document.description}</p>
              <p>{item.downloaded_at}</p> {/* Show download date */}
              <div className="downloads-card-actions">
                <button className="downloads-btn" onClick={() => shareToWhatsApp(item.document)}>Share</button>
                <button className="downloads-delete-btn" onClick={() => handleDownload(item.document.doc_id)}>Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Download;