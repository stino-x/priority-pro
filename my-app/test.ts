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