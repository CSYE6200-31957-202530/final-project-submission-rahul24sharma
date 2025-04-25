import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({}); // Store user names by ID
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/chat/conversations/${currentUserId}`);
        setConversations(response.data);
        
        // Fetch user names for all conversation participants
        const userIds = new Set();
        response.data.forEach(convo => {
          userIds.add(convo.userId);
        });
        
        const names = {};
        for (const id of userIds) {
          try {
            const userResponse = await axios.get(`http://localhost:8080/api/users/${id}`);
            names[id] = userResponse.data.name || `User ${id}`;
          } catch (error) {
            console.error(`Error fetching user info for ID ${id}:`, error);
            names[id] = `User ${id}`;
          }
        }
        setUserNames(names);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Conversations</h2>
        <div className="text-sm text-blue-600">
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700">No conversations yet</h3>
          <p className="text-gray-500 mt-1">Start a new conversation to see it here</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {conversations.map((convo) => (
            <li key={convo.userId}>
              <Link
                to={`/messages/${convo.userId}`}
                className="block p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {userNames[convo.userId]?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userNames[convo.userId] || `User ${convo.userId}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{convo.lastMessage || "No messages yet"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(convo.lastTimestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;