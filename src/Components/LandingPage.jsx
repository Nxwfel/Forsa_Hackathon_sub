// Components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react'
import Logo from '../Assets/Algerie_Telecom.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from '../Contexts/ChatContext';

const LandingPage = () => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [displayedOffers, setDisplayedOffers] = useState([])
  const responsesEndRef = useRef(null);
  const [streamedResponse, setStreamedResponse] = useState('');

  // Get chat context
  const { isConnected, sendMessage, messages, isLoading, error, reconnect } = useChat();

  // -------------------- Helpers --------------------
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Remove lines that are "metadata", not useful for cards
  const stripMetaLines = (text = '') => {
    const lines = String(text).split('\n');
    const filtered = lines.filter(l => {
      const line = l.trim();
      // remove common meta fields your RAG outputs
      return !/^(?:\*+)?\s*(type de document|document|segment|engagement|inclus|source|contexte)\s*:/i.test(line);
    });
    return filtered.join('\n');
  };

  const cleanMarkdown = (text = '') => {
    return String(text)
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/^\s*[-•*]\s+/gm, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
  };


  const normalizeOfferTitle = (rawTitle, speed, message) => {
    let title = cleanMarkdown(rawTitle);

    // If the chatbot outputs only "Offre :" with no name
    if (/^offre\s*:?\s*$/i.test(title)) {
      const packMatch = message.match(/(Pack\s+[^\n*#]+)/i);
      if (packMatch?.[1]) return cleanMarkdown(packMatch[1]);
      if (speed) return `Offre Fibre ${cleanMarkdown(speed)}`;
      return 'Offre Internet';
    }

    // Remove leading "Offre :" prefix
    title = title.replace(/^offre\s*:?\s*/i, '').trim();

    // Optional: keep "Pack ..." as is; otherwise fallback
    return title || (speed ? `Offre Fibre ${cleanMarkdown(speed)}` : 'Offre Internet');
  };

  const makeOffer = ({ title, price, speed, description, downloadLink, badge }, fullMessage) => {
    const cleanedDesc = cleanMarkdown(stripMetaLines(description || 'Offre disponible chez Algérie Télécom'));

    return {
      title: normalizeOfferTitle(title, speed, fullMessage),
      price: price ? cleanMarkdown(String(price)).replace(/[^\d]/g, '') : null,
      speed: speed ? cleanMarkdown(String(speed)) : null,
      description: cleanedDesc,
      downloadLink: downloadLink || null,
      badge: badge || null,
    };
  };

  // Parse "recommended offer" from free-text (freelancer etc.)
  const parseRecommendedOffer = (message) => {
    const recPatterns = [
      /(?:je recommande|je vous recommande|pour un freelance.*?(?:choisir|prends|choisissez)|l’offre la plus adaptée est|offre recommandée\s*:?)\s*[:\-]?\s*([^\n.]+?)(?=$|\n|\.|,)/i
    ];

    let rawTitle = null;
    for (const p of recPatterns) {
      const m = message.match(p);
      if (m?.[1]) {
        rawTitle = m[1].trim();
        break;
      }
    }
    if (!rawTitle) return null;

    // speed
    const speedMatch =
        rawTitle.match(/(\d+(?:\.\d+)?\s*(?:Mbps|Gbps))/i) ||
        message.match(new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,250}?(\\d+(?:\\.\\d+)?\\s*(?:Mbps|Gbps))`, 'i'));
    const speed = speedMatch ? speedMatch[1] : null;

    // price
    const priceMatch =
        message.match(new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,400}?(\\d[\\s,\\.\\d]+)\\s*(?:DZD|DA)`, 'i')) ||
        message.match(/(\d[\s,\.]\d{3}|\d{3,5})\s*(?:DZD|DA)\s*\/?\s*mois/i);
    const price = priceMatch ? String(priceMatch[1]) : null;

    // description (prefer a line containing "freelance")
    let description = '';
    const freelanceLine = message.split('\n').find(l => /freelance/i.test(l));
    if (freelanceLine) description = freelanceLine.trim();

    return makeOffer(
        {
          title: rawTitle,
          speed,
          price,
          description: description || "Offre recommandée selon votre besoin",
          badge: "Recommandé",
        },
        message
    );
  };

  // -------------------- Effects --------------------
  useEffect(() => {
    const botMessages = messages.filter(m => m.type === 'bot' && !m.isError);
    if (botMessages.length > 0) {
      const latestBotMessage = botMessages[botMessages.length - 1];
      setStreamedResponse(latestBotMessage.message);
    }
  }, [messages]);

  // Parse bot messages for offers (recommended first, else list)
  useEffect(() => {
    const botMessages = messages.filter(m => m.type === 'bot' && !m.isError);
    if (botMessages.length === 0) return;

    const latestBotMessage = botMessages[botMessages.length - 1];
    const msg = latestBotMessage?.message || '';

    const recommended = parseRecommendedOffer(msg);
    if (recommended) {
      setDisplayedOffers([recommended]);
      return;
    }

    const offers = parseOffersFromMessage(msg);
    if (offers.length > 0) {
      setDisplayedOffers(offers);
    }
  }, [messages]);

  // -------------------- Offer Parser --------------------
  const parseOffersFromMessage = (message) => {
    const offers = [];

    // Pattern 1: "### 1. Pack ..." OR "### 1. Offre ..."
    const packPattern = /###?\s*\*?\*?(\d+)\.\s*\*?\*?(Pack [^*\n]+|Offre [^*\n]+)/gi;
    let match;

    while ((match = packPattern.exec(message)) !== null) {
      const rawTitle = match[2].trim();

      const pricePattern = new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,500}?(\\d[\\s,\\.\\d]+)\\s*(?:DZD|DA)`, 'i');
      const priceMatch = message.match(pricePattern);
      const price = priceMatch ? priceMatch[1] : null;

      const speedPattern = new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,300}?(\\d+(?:\\.\\d+)?\\s*(?:Mbps|Gbps))`, 'i');
      const speedMatch = message.match(speedPattern);
      const speed = speedMatch ? speedMatch[1] : null;

      const descPattern = new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,80}?\\n([^\\n#]+)`, 'i');
      const descMatch = message.match(descPattern);
      const description = descMatch ? descMatch[1].trim() : '';

      const linkPattern = new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,700}?\\[(Télécharger|Download)\\]\\(([^)]+)\\)`, 'i');
      const linkMatch = message.match(linkPattern);
      const downloadLink = linkMatch ? linkMatch[2] : null;

      offers.push(
          makeOffer(
              {
                title: rawTitle,
                price,
                speed,
                description: description || `Offre disponible chez Algérie Télécom`,
                downloadLink,
              },
              message
          )
      );
    }

    // Pattern 2: Table rows
    if (offers.length === 0) {
      const tablePattern = /\|\s*\*?\*?([^|]+?)\*?\*?\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)(?:\s*(?:DZD|DA))?\s*\|/i;
      const lines = message.split('\n');

      lines.forEach(line => {
        const m = line.match(tablePattern);
        if (m && !line.includes('Offre') && !line.includes('---')) {
          const rawTitle = m[1].trim();
          const speed = m[2].trim();
          const price = m[3].trim();

          if (rawTitle && price.match(/\d/)) {
            offers.push(
                makeOffer(
                    {
                      title: rawTitle,
                      price,
                      speed,
                      description: `Débit: ${speed} - Prix: ${price} DZD/mois`,
                    },
                    message
                )
            );
          }
        }
      });
    }

    // Pattern 3: List format "- 10 Mbps (1900 DZD)"
    if (offers.length === 0) {
      const listPattern = /[-•]\s*\*?\*?(\d+\s*(?:Mbps|Gbps))\*?\*?\s*[\(\[:]?\s*(\d[\s,\.\\d]+)\s*(?:DZD|DA)/gi;
      while ((match = listPattern.exec(message)) !== null) {
        offers.push(
            makeOffer(
                {
                  title: `IDOOM Fibre ${match[1]}`,
                  speed: match[1],
                  price: match[2],
                  description: `Offre fibre optique avec téléphonie fixe`,
                },
                message
            )
        );
      }
    }

    // Pattern 4: Bold title + Prix line
    const newFormatPattern = /\*\*(Offre [^*]+)\*\*[\s\S]*?\*Prix[^:]*:\s*([0-9]+(?:[.,][0-9]{3})*(?:\s*(?:DZD|DA))\/mois)/gi;
    while ((match = newFormatPattern.exec(message)) !== null) {
      const rawTitle = match[1].trim();
      const price = match[2];

      const speedPattern = new RegExp(`${escapeRegExp(rawTitle)}[\\s\\S]{0,250}?([0-9]+(?:\\.[0-9]+)?\\s*(?:Mbps|Gbps))`, 'i');
      const speedMatch = message.match(speedPattern);
      const speed = speedMatch ? speedMatch[1] : null;

      offers.push(
          makeOffer(
              {
                title: rawTitle,
                price,
                speed,
                description: `Offre résidentielle`,
              },
              message
          )
      );
    }

    // Pattern 5: Summary "* 10 Mbps : 1600 DZD/mois"
    const summaryPattern = /[*•]\s*(\d+(?:\.[0-9]+)?\s*(?:Mbps|Gbps))\s*:\s*(\d+[,\s\d]+)\s*(?:DZD|DA)\/mois/gi;
    while ((match = summaryPattern.exec(message)) !== null) {
      offers.push(
          makeOffer(
              {
                title: `Pack Idoom ${match[1]}`,
                speed: match[1],
                price: match[2],
                description: `Offre disponible chez Algérie Télécom`,
              },
              message
          )
      );
    }

    return offers.slice(0, 4);
  };

  // -------------------- UI handlers --------------------
  const isActive = isFocused || query.trim().length > 0

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || !isConnected || isLoading) return;
    sendMessage(query);
    setQuery('');
  }

  const handleExampleClick = (question) => {
    if (!isConnected) return;
    setQuery(question);
    sendMessage(question);
    setQuery('');
  }

  const exampleQuestions = [
    { question: 'Quelles sont les offres fibre disponibles ?' },
    { question: 'Quels sont les forfaits Internet disponibles ?' },
    { question: "Comment puis-je activer un nouveau service ?" },
  ]

  return (
      <AnimatePresence>
        <motion.div
            className="bg-white flex flex-col justify-center items-center overflow-hidden min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* léger fond décoratif */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#1f235a]/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-[#292f81]/10 blur-3xl" />
          </div>

          <div className="w-[60vw] flex flex-col justify-center items-center">
            {/* Connection Status */}
            <motion.div
                className="mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
              <motion.span
                  className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-sm text-gray-600">
              {isConnected ? "Connecté à l'assistant" : 'Déconnecté'}
            </span>
              {!isConnected && error && (
                  <button
                      onClick={reconnect}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Réessayer
                  </button>
              )}
            </motion.div>

            {/* Titre principal animé */}
            <motion.div
                className="flex flex-col justify-center items-center"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
            <span className="text-7xl mt-[5vh] font-semibold text-[#1f235a] flex justify-center items-center">
              Assistant Intelligent
            </span>

              <span className="text-7xl -mt-10 font-semibold text-[#1f235a] flex justify-center items-center">
              D'
              <motion.img
                  src={Logo}
                  alt=""
                  className="size-[30vh]"
                  initial={{ scale: 0.9, rotate: -3, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  whileHover={{ scale: 1.03, rotate: 2 }}
              />
            </span>
            </motion.div>

            {/* Search Form */}
            <motion.form
                onSubmit={handleSubmit}
                className={`relative h-[9vh] w-[50vw] mt-[7vh] rounded-[2.5rem] border backdrop-blur-sm flex items-center transition-all duration-300 ${isActive
                    ? 'border-[#1f235a] shadow-[0_0_25px_rgba(31,35,90,0.25)] bg-white'
                    : 'border-gray-300/70 bg-white/60 shadow-sm'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Label flottant */}
              <motion.label
                  htmlFor="chat-input"
                  className="absolute max-md:text-sm left-6 pointer-events-none poppins"
                  animate={isActive
                      ? { y: -18, scale: 0.8, color: '#1f235a' }
                      : { y: 0, scale: 1, color: 'rgba(156,163,175,0.8)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                Posez votre question ici...
              </motion.label>

              <input
                  id="chat-input"
                  name="chat-input"
                  type="text"
                  className="poppins z-10 text-gray-800 h-full w-full bg-transparent px-5 pt-5 text-md outline-none rounded-[2.5rem]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={!isConnected}
                  autoComplete="off"
              />

              {/* Bouton d'envoi animé */}
              <motion.button
                  type="submit"
                  className="mr-4 flex items-center justify-center rounded-full p-2 hover:bg-[#1f235a]/5 transition-colors z-10"
                  whileTap={{ scale: 0.9 }}
                  disabled={!isConnected || isLoading || !query.trim()}
              >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="gray"
                    className={`size-[2.5vw] max-md:size-[5vw] hover:stroke-[#1f235a] cursor-pointer ${(!isConnected || isLoading || !query.trim()) ? 'opacity-50' : ''}`}
                    animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                    transition={isLoading ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0.3 }}
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </motion.svg>
              </motion.button>

              {/* Ligne d'aide */}
              <div className="absolute max-md:hidden -bottom-6 left-2 text-xs text-gray-400 poppins z-10">
                Appuyez sur Entrée ou cliquez sur la flèche pour lancer l'assistant.
              </div>
            </motion.form>

            {/* Affichage des réponses textuelles */}
            {messages.length > 0 && (
                <motion.div
                    className="w-[50vw] mt-8 max-h-[300px] overflow-y-auto space-y-4 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                  {messages.map((message) => (
                      <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 rounded-xl shadow-md ${message.type === 'user'
                              ? 'bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white ml-auto max-w-[80%]'
                              : message.isError
                                  ? 'bg-red-50 text-red-800 border border-red-200 mr-auto max-w-[90%]'
                                  : 'bg-gray-50 text-gray-800 border border-gray-200 mr-auto max-w-[90%]'
                          }`}
                      >
                        {message.type === 'bot' ? (
                            <WordByWordText
                                text={cleanMarkdown(stripMetaLines(message.message))}
                                className="whitespace-pre-wrap leading-relaxed text-sm"
                            />
                        ) : (
                            <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.message}</p>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {message.timestamp?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                  ))}

                  {isLoading && (
                      <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 mr-auto max-w-[90%] shadow-md"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#1f235a] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm">L'assistant réfléchit...</span>
                        </div>
                      </motion.div>
                  )}
                  <div ref={responsesEndRef} />
                </motion.div>
            )}

            {/* Error message */}
            {error && !isConnected && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-[50vw] mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center justify-between"
                >
                  <span>⚠️ {error}</span>
                  <button
                      onClick={reconnect}
                      className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
                  >
                    Réessayer
                  </button>
                </motion.div>
            )}

            {/* Suggestions de questions */}
            <div className="flex justify-center items-center mt-10 max-md:flex-col">
              {exampleQuestions.map((item, index) => (
                  <motion.button
                      type="button"
                      key={index}
                      onClick={() => handleExampleClick(item.question)}
                      disabled={!isConnected || isLoading}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                      className={`w-full flex flex-col p-3 shadow-lg rounded-xl border border-gray-200/70 justify-center items-center m-4 bg-white/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#1f235a] hover:bg-gray-50 cursor-pointer text-sm text-gray-700 ${(!isConnected || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {item.question}
                  </motion.button>
              ))}
            </div>

            {/* Cartes d'offres dynamiques */}
            {displayedOffers.length > 0 ? (
                <div className="w-full h-fit mt-6 space-y-4">
                  <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl font-bold text-[#1f235a] mb-4"
                  >
                    Offres disponibles
                  </motion.h2>

                  {displayedOffers.map((offer, idx) => (
                      <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="w-full min-h-[20vh] shadow-xl flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] overflow-hidden"
                      >
                        <div className="h-full flex items-center">
                          <motion.img
                              src={Logo}
                              alt=""
                              className="size-[10vw] ml-[2vw]"
                              whileHover={{ scale: 1.05, rotate: 2 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          />
                        </div>
                        <div className="flex flex-col text-white justify-center ml-4 py-4">
                          <h1 className="font-semibold text-3xl">
                            {offer.title}
                          </h1>
                          {offer.speed && (
                              <p className="font-light mt-1 text-sm">
                                Débit: {offer.speed}
                              </p>
                          )}
                          {offer.price && (
                              <p className="font-bold mt-1 text-lg">
                                {offer.price} DZD/mois
                              </p>
                          )}
                          <p className="font-light text-sm mt-2">
                            {offer.description}
                          </p>

                          {offer.badge && (
                              <span className="mt-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs">
                        {offer.badge}
                      </span>
                          )}

                          {offer.downloadLink && (
                              <a
                                  href={offer.downloadLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-block bg-white text-[#1f235a] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                              >
                                Télécharger le PDF
                              </a>
                          )}
                        </div>
                      </motion.div>
                  ))}
                </div>
            ) : (
                <div className="w-full h-fit mt-6 space-y-4">
                  {[
                    { title: 'Pack IDOOM Fibre 100 Mbps', speed: '100 Mbps', price: '3 500', desc: 'Fibre optique avec téléphonie fixe incluse' },
                    { title: 'Pack IDOOM Fibre 500 Mbps', speed: '500 Mbps', price: '4 000', desc: 'Internet ultra-rapide pour toute la famille' },
                    { title: 'Pack IDOOM Fibre 1.5 Gbps', speed: '1.5 Gbps', price: '4 500', desc: "La fibre la plus rapide avec installation gratuite" },
                    { title: 'Pack IDOOM Fibre 10 Mbps', speed: '10 Mbps', price: '1 900', desc: 'Offre économique avec téléphonie fixe' },
                  ].map((offer, idx) => (
                      <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="w-full min-h-[20vh] shadow-xl flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] overflow-hidden"
                      >
                        <div className="h-full flex items-center">
                          <motion.img
                              src={Logo}
                              alt=""
                              className="size-[10vw] ml-[2vw]"
                              whileHover={{ scale: 1.05, rotate: 2 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          />
                        </div>
                        <div className="flex flex-col text-white justify-center ml-4 py-4">
                          <h1 className="font-semibold text-3xl">
                            {offer.title}
                          </h1>
                          <p className="font-light mt-1 text-sm">
                            Débit: {offer.speed}
                          </p>
                          <p className="font-bold mt-1 text-lg">
                            {offer.price} DZD/mois
                          </p>
                          <p className="font-light text-sm mt-2">
                            {offer.desc}
                          </p>
                        </div>
                      </motion.div>
                  ))}
                </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
  )
}

// Word-by-word typing effect component
const WordByWordText = ({ text, className }) => {
  const words = text.split(/(\s+)/);

  return (
      <div className={className}>
        {words.map((word, index) => {
          if (word.trim() === '') return <span key={index}>&nbsp;</span>;
          return (
              <span
                  key={index}
                  className="inline-block"
                  style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.03}s both` }}
              >
            {word}
          </span>
          );
        })}
      </div>
  );
};

// Add CSS animation
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject styles into document
if (!document.querySelector('#word-by-word-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'word-by-word-styles';
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);
}

export default LandingPage
