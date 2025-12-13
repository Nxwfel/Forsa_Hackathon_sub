import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Assets/Algerie_Telecom.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {useChat} from '../Contexts/ChatContext';

const Chatbot = () => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Get chat context
  const { isConnected, sendMessage, messages, isLoading, error, reconnect, clearMessages } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !isConnected || isLoading) return;

    // Send message through WebSocket
    sendMessage(inputValue);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Show visual feedback
    const button = document.querySelector(`[data-text="${text}"]`);
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '✓ Copié!';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    }
  };

  const handleClearChat = () => {
    if (clearMessages) {
      clearMessages();
    }
    setInputValue('');
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (question) => {
    if (!isConnected || isLoading) return;
    sendMessage(question);
    setShowSuggestions(false);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={'/'}>
            <motion.img 
              src={Logo} 
              alt="Algerie Telecom" 
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1f235a]">Assistant Intelligent</h1>
            <div className="flex items-center">
              <motion.span 
                className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <p className="text-xs text-gray-500">
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </p>
              {!isConnected && (
                <button 
                  onClick={reconnect}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Reconnecter
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearChat}
            className="text-sm text-gray-600 hover:text-[#1f235a] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Nouvelle conversation
          </motion.button>
        </div>
      </header>

      {/* Error Banner */}
      {error && !isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 text-white px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
          <button 
            onClick={reconnect}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
          >
            Réessayer
          </button>
        </motion.div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none p-4 max-w-[75%] border border-gray-200">
                <div className="whitespace-pre-wrap break-words">
                  Bonjour! Je suis votre assistant intelligent Algérie Télécom. Comment puis-je vous aider aujourd'hui?
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {formatTime(new Date())}
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 relative group ${
                    message.type === 'user'
                      ? 'bg-[#272fa3] text-white rounded-br-none'
                      : message.isError
                      ? 'bg-red-100 text-red-800 rounded-bl-none border border-red-200'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.message}
                  </div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold text-gray-600 mb-2">📚 Sources:</p>
                      <div className="space-y-2">
                        {message.sources.slice(0, 3).map((source, index) => (
                          <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">• </span>
                            {typeof source === 'string' 
                              ? source 
                              : source.page_content 
                                ? source.page_content.substring(0, 150) + '...'
                                : JSON.stringify(source).substring(0, 150) + '...'}
                          </div>
                        ))}
                        {message.sources.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            +{message.sources.length - 3} autres sources...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' 
                      ? 'text-blue-200' 
                      : message.isError 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  } flex justify-between items-center`}>
                    <span>{formatTime(message.timestamp)}</span>
                    
                    {message.type === 'bot' && !message.isError && (
                      <button
                        data-text={message.message}
                        onClick={() => copyToClipboard(message.message)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:text-gray-700"
                        title="Copier le texte"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none p-4 max-w-[75%] border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">L'assistant réfléchit...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 border-t border-gray-200 py-3 px-4"
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-600 mb-2">Questions fréquentes:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  "Quelles sont les offres fibre disponibles ?",
                  "Quels sont les forfaits Internet disponibles ?",
                  "Comment puis-je activer un nouveau service ?"
                ].map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick(question)}
                    disabled={!isConnected || isLoading}
                    className={`text-left p-3 text-sm bg-white rounded-xl border border-gray-200 text-gray-700 transition-colors shadow-sm ${
                      isConnected && !isLoading
                        ? 'hover:bg-gray-50 hover:border-[#1f235a] cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-end border rounded-2xl bg-white transition-all ${
            isConnected 
              ? 'focus-within:ring-2 focus-within:ring-[#1f235a] focus-within:border-[#1f235a] border-gray-300' 
              : 'border-red-300 bg-red-50'
          }`}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected 
                ? "Posez votre question ici..." 
                : "Impossible d'envoyer des messages: déconnecté"}
              className={`flex-1 resize-none border-0 focus:ring-0 focus:outline-none p-4 text-gray-700 max-h-32 min-h-[44px] rounded-2xl ${
                !isConnected ? 'bg-red-50' : 'bg-white'
              }`}
              rows="1"
              disabled={!isConnected || isLoading}
            />
            <motion.button
              onClick={handleSend}
              disabled={!isConnected || isLoading || !inputValue.trim()}
              whileHover={isConnected && inputValue.trim() ? { scale: 1.05 } : {}}
              whileTap={isConnected && inputValue.trim() ? { scale: 0.95 } : {}}
              className={`m-2 p-2 rounded-full transition-colors ${
                isConnected && inputValue.trim() && !isLoading
                  ? 'bg-[#2b3180] hover:bg-[#292f81] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </motion.button>
          </div>
          
          {!isConnected && (
            <p className="text-red-500 text-sm mt-2 text-center">
              ⚠️ Impossible d'envoyer des messages: déconnecté du serveur
            </p>
          )}
          
          <p className="text-xs text-gray-400 text-center mt-2">
            Appuyez sur Entrée pour envoyer • Shift + Entrée pour nouvelle ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;