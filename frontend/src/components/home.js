import React, { useState, useEffect } from "react";
import "../styles/home.css";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { token_Id } from '../recoil/atoms';
// import { handlePayNow } from '../utils/payment'

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uid } = useRecoilValue(token_Id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getDocs/");
        setCardData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCards = cardData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const confirmDownload = window.confirm("Are you sure you want to download this document?");
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
        alert("File downloaded successfully!"); // Alert after successful download
      } catch (err) {
        setError("Failed to download file");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="homeSection">
        <div className="searchSection">
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="sloganSection">
          <h1>Prime Transfer</h1>
          <p>FIND IT, SHARE IT!</p>
        </div>

        <div className="cardsSection">
          {filteredCards.map((card) => (
            <div key={card.doc_id} className="card">
              <h3>{card.title}</h3>
              <p>{card.author}</p>
              <p>{card.description}</p>
              <p>{card.size}</p>
              <button onClick={() => handleDownload(card.doc_id)}>Download</button>
              <button onClick={() => shareToWhatsApp(card)}>Share</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;