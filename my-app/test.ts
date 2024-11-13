'use client';

import { useEffect, useRef, useState } from 'react';

const ChatPage = ({ params: { chat_id } }: ChatPageProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial chat data
    const fetchChat = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedChat = await getChat(chat_id);

        if (Array.isArray(fetchedChat) && fetchedChat.length > 0) {
          setChat(fetchedChat[0]);
        } else {
          setError('Chat not found');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch chat');
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chat_id]);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:8000');

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          if (messageData.type === 'message') {
            setMessages(prev => [...prev, messageData.data]);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || !wsRef.current) return;

    const messageData = {
      message_id: Date.now().toString(),
      chat_id: chat_id,
      sender_id: chat.user1_id,
      receiver_id: chat.user2_id,
      content: newMessage,
      time_sent: new Date().toISOString(),
    };

    try {
      // Send message through WebSocket
      wsRef.current.send(JSON.stringify(messageData));

      // Add message to local state immediately
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

      // Optionally persist to database
      await sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  // Rest of your component remains the same...

  return (
    <div className="flex flex-col h-screen">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.message_id}>
              {msg.sender_id === chat?.user1_id ? (
                <div className="p-3 rounded-lg max-w-[80%] ml-auto bg-blue-500 text-white">
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-75">
                    {new Date(msg.time_sent).toLocaleTimeString()}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-lg max-w-[80%] bg-gray-200">
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-75">
                    {new Date(msg.time_sent).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
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
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;