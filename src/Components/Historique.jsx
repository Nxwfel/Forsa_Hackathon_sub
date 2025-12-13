import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../Contexts/ChatContext';

const Historique = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { messages } = useChat();

  // Backend URL from environment or default
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://192.168.85.94:8000';

 // Update your useEffect hook to handle CORS issues:
useEffect(() => {
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/rest_chat/history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('History fetched:', data);
      
      // Handle the new backend format where history is in data.history
      const historyArray = Array.isArray(data) ? data : 
                          Array.isArray(data.history) ? data.history : 
                          [];
      
      // Sort by newest first
      const sortedHistory = historyArray.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setHistory(sortedHistory);
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      // Check if it's a CORS issue
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        setError('Erreur CORS: Le backend doit autoriser les requêtes depuis le frontend. Veuillez vérifier la configuration du serveur.');
      } else if (err.message.includes('NetworkError')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [BACKEND_URL]);
  // Update history when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Group messages into conversations
      const conversations = [];
      let currentConversation = null;

      messages.forEach((msg, index) => {
        if (msg.type === 'user') {
          // Start a new conversation
          currentConversation = {
            id: `temp-${Date.now()}-${index}`,
            question: msg.message,
            response: '',
            timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
            category: 'Recent',
            sources: []
          };
        } else if (msg.type === 'bot' && currentConversation) {
          // Add bot response to current conversation
          currentConversation.response = msg.message;
          currentConversation.sources = msg.sources || [];
          conversations.push({ ...currentConversation });
          currentConversation = null;
        }
      });

      // Add temporary conversations to history (at the beginning)
      if (conversations.length > 0) {
        setHistory(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newConversations = conversations.filter(conv => !existingIds.has(conv.id));
          return [...newConversations, ...prev];
        });
      }
    }
  }, [messages]);

  const filteredHistory = history.filter(chat =>
    (chat.question?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (chat.response?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1f235a] mx-auto"></div>
          <p className='mt-4 text-lg text-gray-600'>Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-red-200'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>Erreur de connexion</h3>
          <p className='text-red-600 mb-6'>{error}</p>
          
          <div className='flex gap-3 justify-center'>
            <button 
              onClick={retryFetch}
              className='px-6 py-3 bg-[#1f235a] text-white rounded-lg hover:bg-[#292f81] transition-colors font-medium'
            >
              Réessayer
            </button>
            <button 
              onClick={() => setError(null)}
              className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium'
            >
              Continuer sans historique
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen py-10'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-6xl font-bold text-[#1f235a] mb-4'>Historique</h1>
          <p className='text-xl text-gray-600'>Consultez vos conversations et résultats précédents</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8'
        >
          <div className='relative'>
            <input
              type="text"
              placeholder='Rechercher dans l historique...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full h-14 px-5 pr-12 rounded-2xl border-2 border-gray-200 focus:border-[#1f235a] outline-none transition-all bg-white shadow-sm'
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Chat History List */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white rounded-2xl shadow-lg p-4 max-h-[75vh] overflow-y-auto'
            >
              <h2 className='text-2xl font-semibold text-[#1f235a] mb-4 sticky top-0 bg-white pb-2 z-10'>
                Conversations ({filteredHistory.length})
              </h2>
              <div className='space-y-3'>
                {filteredHistory.length === 0 ? (
                  <div className='text-center py-10 text-gray-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 mx-auto mb-4 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <p className='font-medium text-gray-700 mb-1'>Aucune conversation trouvée</p>
                    <p className='text-sm text-gray-500'>Commencez à discuter avec l'assistant</p>
                  </div>
                ) : (
                  filteredHistory.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedChat?.id === chat.id
                          ? 'bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 flex-shrink-0 mt-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm line-clamp-2 mb-1'>
                            {chat.question || 'Question sans titre'}
                          </p>
                          <div className='flex items-center justify-between mt-2'>
                            <span className={`text-xs ${selectedChat?.id === chat.id ? 'text-white/80' : 'text-gray-500'}`}>
                              {new Date(chat.timestamp).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedChat?.id === chat.id
                                ? 'bg-white/20'
                                : 'bg-[#1f235a]/10 text-[#1f235a]'
                            }`}>
                              {chat.category || 'Général'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Selected Chat Details */}
          <div className='lg:col-span-2'>
            <AnimatePresence mode='wait'>
              {selectedChat ? (
                <motion.div
                  key={selectedChat.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='bg-white rounded-2xl shadow-lg p-6'
                >
                  {/* Question */}
                  <div className='mb-6'>
                    <div className='flex items-start gap-3 mb-3'>
                      <div className='bg-[#1f235a] p-2 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-500 mb-1'>Votre question</p>
                        <p className='text-lg font-medium text-gray-800'>{selectedChat.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div className='mb-6 bg-gray-50 rounded-xl p-4'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-gradient-to-r from-[#1f235a] to-[#292f81] p-2 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-500 mb-2'>Réponse de l'assistant</p>
                        <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{selectedChat.response}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sources */}
                  {selectedChat.sources && selectedChat.sources.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-xl font-semibold text-[#1f235a] mb-4 flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Sources ({selectedChat.sources.length})
                      </h3>
                      <div className='space-y-3'>
                        {selectedChat.sources.slice(0, 5).map((source, index) => (
                          <div key={index} className='p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#1f235a] transition-colors'>
                            <p className='text-sm text-gray-700'>
                              {typeof source === 'string' 
                                ? source 
                                : source.page_content 
                                  ? source.page_content.substring(0, 200) + '...'
                                  : 'Source non disponible'}
                            </p>
                            {source.metadata?.source && (
                              <p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {source.metadata.source}
                              </p>
                            )}
                          </div>
                        ))}
                        {selectedChat.sources.length > 5 && (
                          <p className='text-sm text-gray-500 italic text-center'>
                            +{selectedChat.sources.length - 5} autres sources...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className='mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500'>
                    <span className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {new Date(selectedChat.timestamp).toLocaleString('fr-FR')}
                    </span>
                    <span className='px-3 py-1 bg-[#1f235a]/10 text-[#1f235a] rounded-full font-medium'>
                      {selectedChat.category || 'Général'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='bg-white rounded-2xl shadow-lg p-12 text-center h-full flex flex-col items-center justify-center'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                  <h3 className='text-2xl font-semibold text-gray-700 mb-2'>Sélectionnez une conversation</h3>
                  <p className='text-gray-500'>Choisissez une conversation dans la liste pour voir les détails</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Historique