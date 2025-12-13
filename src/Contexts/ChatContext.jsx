import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://192.168.85.94:8000/ws/chat';
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('⚠️ Already connected');
      return;
    }

    try {
      console.log('🔌 Connecting to:', WS_URL);
      setConnectionStatus('connecting');

      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('📨 Received:', response);

          if (response.event === 'bot_reply') {
            const { message, sources } = response.data;
            
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                type: 'bot',
                message: message,
                sources: sources || [],
                timestamp: new Date(),
              },
            ]);
            setIsLoading(false);

          } else if (response.event === 'error') {
            const errorMsg = response.data.message;
            console.error('❌ Server error:', errorMsg);
            
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                type: 'bot',
                message: `Erreur: ${errorMsg}`,
                isError: true,
                timestamp: new Date(),
              },
            ]);
            setError(errorMsg);
            setIsLoading(false);

          } else if (response.event === 'batch_answers') {
            console.log('📋 Batch answers:', response.data);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                type: 'bot',
                message: 'Réponses au questionnaire reçues!',
                batchData: response.data,
                timestamp: new Date(),
              },
            ]);
            setIsLoading(false);
          }

        } catch (err) {
          console.error('❌ Error parsing message:', err);
          setError('Erreur de traitement du message');
          setIsLoading(false);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setError('Erreur de connexion');
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsLoading(false);
        setConnectionStatus('disconnected');

        // Auto-reconnect
        if (
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttemptsRef.current += 1;
          setConnectionStatus(`reconnecting (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`🔄 Reconnect attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);
            connect();
          }, RECONNECT_DELAY);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setError('Impossible de se connecter au serveur');
          setConnectionStatus('failed');
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('❌ Error creating WebSocket:', err);
      setError('Erreur de connexion');
      setConnectionStatus('error');
    }
  }, [WS_URL]);

  // Disconnect
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Send message
  const sendMessage = useCallback((message) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      setError('Non connecté au serveur');
      return false;
    }

    if (!message.trim()) {
      console.error('❌ Empty message');
      return false;
    }

    try {
      // Add user message to state
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'user',
          message: message,
          timestamp: new Date(),
        },
      ]);

      // Send to backend
      const payload = {
        event: 'user_message',
        data: {
          message: message,
        },
      };

      console.log('📤 Sending:', payload);
      wsRef.current.send(JSON.stringify(payload));
      setIsLoading(true);
      setError(null);
      return true;

    } catch (err) {
      console.error('❌ Error sending message:', err);
      setError('Erreur lors de l\'envoi');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Send batch questions
  const sendBatchQuestions = useCallback((questionsPayload, offerName = 'Offre_01') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      setError('Non connecté au serveur');
      return false;
    }

    try {
      const payload = {
        event: 'batch_questions',
        data: {
          payload: questionsPayload,
          offer_name: offerName,
        },
      };

      console.log('📤 Sending batch questions:', payload);
      wsRef.current.send(JSON.stringify(payload));
      setIsLoading(true);
      setError(null);
      return true;

    } catch (err) {
      console.error('❌ Error sending batch questions:', err);
      setError('Erreur lors de l\'envoi');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Reconnect manually
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    shouldReconnectRef.current = true;
    setError(null);
    disconnect();
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  const value = {
    messages,
    isConnected,
    isLoading,
    error,
    connectionStatus,
    sendMessage,
    sendBatchQuestions,
    clearMessages,
    reconnect,
    connect,
    disconnect,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;