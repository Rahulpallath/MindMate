import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Heart, Smile, Meh, Frown, AlertCircle,
  Menu, X, MessageCircle, Settings, Moon, Sun
} from 'lucide-react';
import {  Link } from 'react-router-dom';

const MindMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindMate, your AI companion for emotional support. How are you doing today?",
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    try {
      const response = await fetch('https://<YOUR_API_ENDPOINT>/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText, mood: currentMood })
      });
      const data = await response.json();

      const botResponse = {
        id: messages.length + 2,
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
        mood: 'supportive'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: 'Oops! Something went wrong. Try again later.',
        sender: 'bot',
        timestamp: new Date(),
        mood: 'error'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const moodIcons = {
    happy: <Smile className="w-6 h-6" />, neutral: <Meh className="w-6 h-6" />, sad: <Frown className="w-6 h-6" />
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>MindMate</h1>
            </Link>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button> 
        </div>
        <div className="p-4 space-y-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Coping Strategies</h3>
            <ul className="space-y-2 text-sm">
              {copingStrategies.slice(0, 3).map((s, i) => (
                <li key={i} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>• {s}</li>
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
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm'} border-b px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chat with MindMate</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isOffline ? 'Limited offline support' : 'AI-powered emotional support'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`px-4 py-2 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
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
                  className={`p-2 rounded-full transition-colors ${currentMood === mood ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80'}`}>
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className={`flex-1 resize-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800'}`}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
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
