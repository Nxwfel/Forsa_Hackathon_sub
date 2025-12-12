import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Assets/Algerie_Telecom.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! Je suis votre assistant intelligent. Comment puis-je vous aider aujourd'hui?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock responses for demonstration
  const mockResponses = [
    "Pour vérifier votre consommation de données, envoyez 'CONSOMMATION' au 1234 ou connectez-vous à votre espace client.",
    "Nous proposons plusieurs forfaits Internet : Forfait 10GB à 199DA/mois, Forfait 30GB à 499DA/mois et Forfait 100GB à 999DA/mois.",
    "Pour activer un nouveau service, rendez-vous dans la section 'Services' de votre espace client ou contactez notre service client au 3131."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center">
        
        <div className="flex items-center space-x-3">
            <Link to={'/'}>
             <img src={Logo} alt="Algerie Telecom" className="h-12 w-auto hover:scale-110" />
            </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1f235a]">Assistant Intelligent</h1>
            <p className="text-xs text-gray-500">Toujours disponible pour vous aider</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 relative group ${
                    message.sender === 'user'
                      ? 'bg-[#1f235a] text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.text}
                  </div>
                  
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} flex justify-end`}>
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(message.text)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50"
                      title="Copier le texte"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none p-4 max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end border border-gray-300 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-[#1f235a] focus-within:border-[#1f235a] transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question ici..."
              className="flex-1 resize-none border-0 focus:ring-0 focus:outline-none p-4 text-gray-700 max-h-32"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className={`m-2 p-2 rounded-full ${
                inputValue.trim()
                  ? 'bg-[#1f235a] hover:bg-[#292f81] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Comment puis-je vérifier ma consommation de données ?",
              "Quels sont les forfaits Internet disponibles ?",
              "Comment puis-je activer un nouveau service ?"
            ].map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInputValue(question)}
                className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-700 transition-colors truncate"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;