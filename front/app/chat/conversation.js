"use client";

import { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
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

const ConversationDetails = ({ selectedConversation, onNewMessageSent }) => {
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [model, setModel] = useState("codestral-2405");
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("mistral-AI-token");
      setToken(storedToken);
    }
  }, [isClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/chat/${selectedConversation.id}`,
        { content: userMessage, model: model },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="conversation-container">
        <div className="conversation-details">
          {selectedConversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === "user" ? "user-message" : "assistant-message"}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-wrapper">
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
            placeholder="Ecrivez un message..."
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
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          height: 100vh;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .conversation-container {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .conversation-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
          max-height: calc(100vh - 220px);
          overflow-y: auto;
          margin-bottom: 10px;
          flex-grow: 1;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
          width: 100%;
        }

        .conversation-details::-webkit-scrollbar {
          width: 12px;
        }

        .conversation-details::-webkit-scrollbar-thumb {
          background-color: rgba(200, 200, 200, 0.5);
          border-radius: 10px;
        }

        .input-container {
          margin-top: 10px;
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
          height: 80px;
          resize: vertical;
          padding: 8px;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
          resize: none;
        }

        .message {
          padding: 15px;
          border-radius: 8px;
          width: 86%;
          font-size: 16px;
          line-height: 1.5;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .user-message {
          background-color: rgb(0, 130, 255);
          color: white;
          align-self: flex-end;
          margin-right: 2%;
        }

        .assistant-message {
          background-color: rgb(0, 210, 255);
          color: black;
          align-self: flex-start;
          margin-left: 2%;
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

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ConversationDetails;
