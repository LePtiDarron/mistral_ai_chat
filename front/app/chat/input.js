import { useState, useEffect } from "react";
import { FaArrowUp } from 'react-icons/fa';
import axios from "axios";
import Select from 'react-select';

const customStyles = {
  dropdownIndicator: (provided) => ({
    ...provided,
    paddingRight: '12px',
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(230, 230, 230)',
    borderRadius: '20px',
    borderWidth: 0,
    color: '#333',
    fontSize: '16px',
    padding: '4px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    boxShadow: state.isFocused ? 'none' : 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '20px',
    backgroundColor: 'rgba(230, 230, 230)',
    padding: '0',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(150, 150, 150, 0.3)' : 'transparent',
    color: '#333',
    padding: '10px 16px',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: 'rgba(150, 150, 150, 0.5)',
    }
  }),
};

const MessageInput = ({ onNewMessageSent }) => {
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [model, setModel] = useState("codestral-2405");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("mistral-AI-token");
      setToken(storedToken);
    }
  }, [isClient]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/chat`,
        { 
          content: userMessage,
          model: model
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (res.data.conversation) {
        onNewMessageSent(res.data.conversation);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUserMessage("");
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="main-content">
      <div className="input-wrapper">
        <img src="/mistral.png" alt="Logo" className="logo" />
        <Select 
          options={[
            { value: 'codestral-2405', label: 'codestral-2405' },
            { value: 'codestral-latest', label: 'codestral-latest' },
          ]}
          value={{ value: model, label: model }}
          onChange={(selectedOption) => setModel(selectedOption.value)}
          isDisabled={loading}
          styles={customStyles}
        />

        <div className="input-container">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={loading}
            placeholder="write a message..."
            rows="3"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={loading} 
            className="send-button"
          >
            {loading ? <div className="spinner"></div> : <FaArrowUp style={{ fontSize: '20px', color: 'white' }} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .logo {
          width: 50%;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          margin-bottom: 30px;
        }

        .main-content {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          gap: 20px;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 600px;
        }

        .input-container {
          margin-top: 10px;
          width: 100%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          position: relative;
        }

        .input-container textarea {
          width: 100%;
          height: 150px;
          resize: vertical;
          padding: 8px;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
          resize: none;
        }

        .input-container textarea:focus {
          border-color: transparent;
        }

        .send-button {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgb(0, 130, 255);
          color: white;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }

        .spinner {
          border: 4px solid transparent;
          border-top: 4px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          position: absolute;
          top: 25%;
          left: 25%;
          transform: translate(-50%, -50%);
        }

        .send-button:disabled {
          background-color: gray;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
