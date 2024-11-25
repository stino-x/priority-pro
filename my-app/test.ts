'use client';

import { getChat } from '@/lib/actions/chat.action';
import { getMessages, sendMessage } from '@/lib/actions/message.action';
import { useEffect, useRef, useState } from 'react';
import { Chat, Message } from '@/lib/interfaces/interface';
import { getLoggedInUser } from '@/lib/actions/user.action';
import { formatDistanceToNow } from 'date-fns';

interface ChatPageProps {
  params: {
    chat_id: string;
  };
}

const ChatPage = ({ params: { chat_id } }: ChatPageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("wss://socket-prioprity-pro.onrender.com");

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        // Join the chat room
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'join',
            chat_id: chat_id
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          if (messageData.type === 'message' && messageData.data.chat_id === chat_id) {
            setMessages(prev => [...prev, messageData.data]);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [chat_id]);

  // Fetch initial data
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const user = await getLoggedInUser();
        if (!user) {
          throw new Error('No user found');
        }
        setCurrentUser(user);

        // Get chat details
        const fetchedChat = await getChat(chat_id);
        if (!Array.isArray(fetchedChat) || fetchedChat.length === 0) {
          throw new Error('Chat not found');
        }
        setChat(fetchedChat[0]);

        // Get messages
        const chatMessages = await getMessages(chat_id);
        if (Array.isArray(chatMessages)) {
          setMessages(chatMessages);
        }

      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [chat_id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || !currentUser) return;

    const messageData = {
      chat_id: chat_id,
      sender_id: currentUser.userid,
      receiver_id: chat.user2_id === currentUser.userid ? chat.user1_id : chat.user2_id,
      content: newMessage,
      time_sent: new Date().toISOString()
    };

    try {
      // Send to WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          data: messageData
        }));
      }

      // Save to database
      await sendMessage(messageData);
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const formatMessageTime = (time: string) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 flex items-center">
        <h1 className="text-lg font-semibold">
          {chat?.title || 'Chat'}
        </h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.$id}
                className={`flex flex-col ${
                  msg.sender_id === currentUser?.userid ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender_id === currentUser?.userid
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  {msg.content}
                  <div className={`text-xs mt-1 ${
                    msg.sender_id === currentUser?.userid
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}>
                    {formatMessageTime(msg.time_sent)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={loading || !newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;





<div className="border-t p-4 flex gap-2">
<input
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
  placeholder="Type a message"
  className="flex-1 p-2 border rounded-lg"
/>
<button 
  onClick={handleSendMessage}
  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
>
  send
</button>
</div>