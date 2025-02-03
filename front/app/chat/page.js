"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrashAlt, FaCog, FaPen, FaSignOutAlt } from 'react-icons/fa';
import MessageInput from './input';
import ConversationDetails from './conversation';
import { useRouter } from 'next/navigation';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [renamingConversation, setRenamingConversation] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("mistral-AI-token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchConversations();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setUsername(res.data);
      }
    } catch (error) {
      console.error("Error while fetching profile:", error);
    }
  };
  
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/conversation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setConversations(res.data);
      }
    } catch (error) {
      console.error("Error while fetching conversations:", error);
    }
  };

  const handleNewMessageClick = () => {
    setSelectedConversation(null);
  };

  const handleRename = (conversation) => {
    setSelectedConversation(conversation);
    setNewTitle(conversation.title);
    setRenamingConversation(conversation.id);
    setShowMenu(null);
  };

  const handleRenameSubmit = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/conversation/${selectedConversation.id}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (res.data) {
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.id === selectedConversation.id
              ? { ...conversation, title: newTitle }
              : conversation
          )
        );
        setRenamingConversation(null);
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }
  };

  const handleMessageSent = async (currentConversation) => {
    try {
      await fetchConversations();
      setSelectedConversation(currentConversation);
    } catch (error) {
      console.error("Error sending the message:", error);
    }
  };

  const handleNewMessageSent = async (newConversation) => {
    try {
      await fetchConversations();
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Error sending the message:", error);
    }
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/conversation/${selectedConversation.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConversations(conversations.filter(convo => convo.id !== selectedConversation.id));
      setShowMenu(null);
      setSelectedConversation(null);
    } catch (error) {
      console.error("Error deleting the conversation:", error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleLogout = () => {
    localStorage.removeItem("mistral-AI-token");
    setToken(null);
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("mistral-AI-token");
      setToken(null);
      router.push('/');
    } catch (error) {
      console.error("Error while deleting the accout:", error);
    }
  };

  const toggleSessionMenu = () => {
    setShowSessionMenu(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu && 
        !event.target.closest(".menu-edit") && 
        !event.target.closest(".gear-button")
      ) {
        setShowMenu(null);
      }
      if (showSessionMenu && !event.target.closest(".session-menu") && !event.target.closest(".header-button")) {
        setShowSessionMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu, showSessionMenu]);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="session-container">
          <button className="header-button" onClick={toggleSessionMenu}>
            {username ? <h3>{username}'s session</h3> : <h3>Loading...</h3>}
          </button>
          {showSessionMenu && (
            <div className="session-menu">
              <button onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '8px' }} /> Disconnect
              </button>
              <button onClick={handleDeleteAccount}>
                <FaTrashAlt style={{ marginRight: '8px' }} /> Delete my account
              </button>
            </div>
          )}
        </div>

        <button className="header-button" onClick={handleNewMessageClick}>
          <FaPen style={{ marginRight: '8px' }} /> Write a new message
        </button>

        <div className="conversations-list">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map((conversation, index) => (
                <li 
                  key={index}
                  onMouseEnter={() => setHoveredConversation(conversation.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  onClick={() => handleConversationClick(conversation)}
                  style={{
                    position: "relative", 
                    cursor: "pointer", 
                    backgroundColor: selectedConversation?.id === conversation.id ? '#007bff' : 
                                     (hoveredConversation === conversation.id ? 'rgb(230, 230, 230)' : 'transparent'),
                    color: selectedConversation?.id === conversation.id ? 'white' : 
                           (hoveredConversation === conversation.id ? 'black' : 'inherit'),
                  }}
                >
                  {renamingConversation === conversation.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={handleRenameSubmit}
                      autoFocus
                    />
                  ) : (
                    conversation.title
                  )}
                  {(hoveredConversation === conversation.id || selectedConversation?.id === conversation.id) && !renamingConversation && (
                    <button 
                      className="gear-button" 
                      onClick={() => { 
                        setShowMenu(conversation.id); 
                        setSelectedConversation(conversation); 
                      }}
                    >
                      <FaCog style={{ fontSize: '20px', color: '#555' }} />
                    </button>
                  )}
                  {showMenu === conversation.id && !renamingConversation && (
                    <div className="menu-edit">
                      <button onClick={() => handleRename(conversation)}>
                        <FaPencilAlt style={{ marginRight: '8px' }} /> Rename
                      </button>
                      <button className="delete-button" onClick={handleDelete}>
                        <FaTrashAlt style={{ marginRight: '8px' }} /> Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No previous conversations.</p>
          )}
        </div>
      </div>

      {selectedConversation ? (
        <ConversationDetails selectedConversation={selectedConversation} onNewMessageSent={handleMessageSent}/>
      ) : (
        <MessageInput onNewMessageSent={handleNewMessageSent} />
      )}

      <style jsx>{`
        .container {
          display: flex;
          height: 100vh;
          background-color: #f9f9f9;
        }

        .header-button {
          transition: background-color 0.1s;
          cursor: pointer;
          margin-bottom: 20px;
          width: 100%;
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.1s;
          border: none;
          border-radius: 10px;
          position: relative;
          background-color: white;
          font-size: 16px;
        }

        .header-button:hover {
          background-color: rgb(230, 230, 230);
        }

        .session-menu {
          position: absolute;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 260px;
          top: 50px;
          left: 20px;
          margin-top: 10px;
          z-index: 10;
        }

        .session-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          background-color: white;
          border: none;
          cursor: pointer;
          padding: 10px;
          font-size: 14px;
          border-radius: 5px;
          text-align: center;
          color: rgb(240, 50, 50);
        }

        .session-menu button:hover {
          background-color: rgb(230, 230, 230);
        }

        .sidebar {
          width: 300px;
          background-color: white;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-right: 1px solid #ccc;
        }

        .conversations-list {
          overflow-x: hidden;
          flex: 1;
          overflow-y: auto;
          height: calc(100vh - 200px);
          padding-right: 10px;
        }

        .conversations-list::-webkit-scrollbar {
          width: 10px;
        }

        .conversations-list::-webkit-scrollbar-thumb {
          background-color: rgba(200, 200, 200, 0.5);
          border-radius: 10px;
        }

        .conversations-list ul {
          list-style: none;
          padding: 0;
        }

        .conversations-list li {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.1s;
          border-radius: 10px;
          position: relative;
        }

        .gear-button {
          position: absolute;
          right: 4%;
          top: 55%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .gear-button:hover {
          color: rgb(0, 130, 255);
        }

        .menu-edit {
          position: absolute;
          left: 0%;
          top: 38px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 5px;
          z-index: 10;
          align-items: center;
        }

        .menu-edit button {
          width: 100%;
          display: flex;
          align-items: center;
          background-color: white;
          border: none;
          cursor: pointer;
          padding: 10px;
          font-size: 14px;
          border-radius: 5px;
          text-align: center;
        }

        .menu-edit button:hover {
          background-color: rgb(230, 230, 230);
        }

        .delete-button {
          color: rgb(240, 50, 50);
        }
      `}</style>
    </div>
  );
};

export default Chat;
