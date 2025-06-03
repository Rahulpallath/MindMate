import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Smile, Meh, Frown, AlertCircle, Menu, X, MessageCircle, Settings, Moon, Sun } from 'lucide-react';

const MindMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindMate, your AI companion for emotional support. I'm here to listen and help you through whatever you're feeling. How are you doing today?",
      sender: 'bot',
      timestamp: new Date(),
      mood: 'supportive'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock bot responses (replace with actual Bedrock integration)
  const getBotResponse = (userMessage) => {
    const responses = {
      anxious: [
        "I hear that you're feeling anxious. That's completely valid. Let's try a simple breathing exercise: breathe in for 4 counts, hold for 4, then out for 4. Would you like to try this together?",
        "Anxiety can feel overwhelming, but you're not alone. One thing that might help is grounding yourself - can you name 5 things you can see around you right now?"
      ],
      sad: [
        "I'm sorry you're going through a difficult time. Your feelings are valid and it's okay to feel sad. Sometimes talking about what's bothering you can help. Would you like to share what's on your mind?",
        "It sounds like you're having a tough day. Remember that it's okay to not be okay sometimes. What's one small thing that usually brings you a little comfort?"
      ],
      stressed: [
        "Stress can be really challenging to deal with. Let's break things down - what's the main thing causing you stress right now? Sometimes organizing our thoughts can help us feel more in control.",
        "I understand you're feeling stressed. Have you tried any relaxation techniques today? Even a few minutes of deep breathing or gentle stretching can make a difference."
      ],
      default: [
        "Thank you for sharing that with me. I'm here to listen and support you. How does that make you feel?",
        "I appreciate you opening up. Your feelings and experiences matter. What would be most helpful for you right now?",
        "That sounds important to you. Can you tell me more about how you're processing this?"
      ]
    };

    // Simple keyword detection (replace with more sophisticated NLP)
    const lowerMessage = userMessage.toLowerCase();
    let responseType = 'default';
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
      responseType = 'anxious';
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      responseType = 'sad';
    } else if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      responseType = 'stressed';
    }

    const responseArray = responses[responseType];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      mood: currentMood
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: isOffline ? 
          "I notice you're offline right now. While I can't access my full capabilities, I'm still here for you. Try taking some deep breaths and remember that difficult feelings are temporary. When you're back online, we can continue our conversation." :
          getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
        mood: 'supportive'
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const moodIcons = {
    happy: <Smile className="w-6 h-6" />,
    neutral: <Meh className="w-6 h-6" />,
    sad: <Frown className="w-6 h-6" />
  };

  const copingStrategies = [
    "Try the 4-7-8 breathing technique",
    "Practice mindful observation",
    "Write down three things you're grateful for",
    "Take a short walk outside",
    "Listen to calming music",
    "Do some gentle stretching"
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>MindMate</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Coping Strategies</h3>
            <ul className="space-y-2 text-sm">
              {copingStrategies.slice(0, 3).map((strategy, index) => (
                <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>• {strategy}</li>
              ))}
            </ul>
          </div>
          
          <div className={`p-3 rounded-lg ${isOffline ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium">
                {isOffline ? 'Offline Mode' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm'} border-b px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chat with MindMate</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isOffline ? 'Limited offline support' : 'AI-powered emotional support'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' 
                    ? 'text-blue-100' 
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`px-4 py-2 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mood Selector */}
        <div className={`px-4 py-2 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80'}`}>
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>How are you feeling?</span>
            <div className="flex space-x-2">
              {Object.entries(moodIcons).map(([mood, icon]) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-2 rounded-full transition-colors ${
                    currentMood === mood 
                      ? 'bg-blue-500 text-white' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80'}`}>
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className={`flex-1 resize-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800'
              }`}
              rows={1}
              style={{minHeight: '44px', maxHeight: '120px'}}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {isOffline && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Limited functionality in offline mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMate;