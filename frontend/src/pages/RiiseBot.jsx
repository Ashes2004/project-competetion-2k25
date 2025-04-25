import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { marked } from 'marked';

const RIISEBotWidget = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);

  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  useEffect(() => {
    // Add welcome message when chat is opened
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          text: "Welcome to RIISE Bot. I'm here to help you navigate the unified platform for Research, IPR, Innovation, and Startup Ecosystem management. How can I assist you today?"
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      // API call
      const response = await fetch('https://riise-buddy.vercel.app/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      // Add bot response
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          text: "I'm sorry, I couldn't process your request. Please try again later."
        }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={`fixed z-50 ${positionStyles[position]}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg transition-all"
        >
          <MessageCircle size={20} />
          <span>RIISE Buddy</span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden" 
             style={{ width: '350px', height: isMinimized ? '60px' : '500px' }}>
          {/* Header */}
          <div className="bg-indigo-700 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-indigo-700 text-lg font-bold">R</span>
              </div>
              <span className="font-semibold">RIISE Buddy</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleMinimize} className="p-1 hover:bg-indigo-800 rounded">
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={toggleChat} className="p-1 hover:bg-indigo-800 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          {!isMinimized && (
            <>
              <main className="flex-1 p-3 overflow-y-auto" ref={chatBoxRef}>
                <div className="flex flex-col gap-3">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`max-w-[80%] p-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'self-end ml-auto bg-indigo-600 text-white rounded-br-none' 
                          : 'self-start mr-auto bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.type === 'bot' && (
                        <div className="flex items-center gap-2 mb-1 text-xs font-medium text-gray-500">
                          RIISE Buddy
                        </div>
                      )}
                      
                      {msg.type === 'bot' ? (
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: marked(msg.text) }} />
                      ) : (
                        <div className="text-sm">{msg.text}</div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="self-start flex items-center gap-1 text-gray-500 bg-gray-100 p-2 rounded-lg rounded-bl-none">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </main>

              {/* Input Area */}
              <footer className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-4"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-indigo-600 text-white border-none rounded-full hover:bg-indigo-700 focus:outline-none"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RIISEBotWidget;