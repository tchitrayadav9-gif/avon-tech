import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_URL } from '../context/AuthContext';
import { Bot, Send, User, Sparkles, AlertCircle } from 'lucide-react';

const AIChat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I am the **Avon Smart Enterprise AI Assistant**.\n\nI can help you navigate operations and query real-time database details. Try asking me:\n\n* "Show my project status"\n* "What is the status of my support tickets?"\n* "What services does Avon Technologies provide?"\n* "How do I raise a ticket?"\n* "Show Avon contact information and office address"`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [suggestions, setSuggestions] = useState([
    'Check my projects',
    'What services does Avon offer?',
    'How do I raise a ticket?',
    'Contact information'
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Push user message
    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ai/chat`, {
        message: textToSend
      });

      if (res.data.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.reply,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
        setSuggestions(res.data.suggestions || []);
      }
    } catch (err) {
      const errMsg = {
        sender: 'ai',
        text: 'I encountered an error querying the database. Please try again in a moment or verify that the backend is online.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Convert markdown-style bullet points in reply to HTML lists
  const formatReplyText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Bold syntax
      let lineFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Bullets
      if (line.startsWith('•') || line.startsWith('*')) {
        return (
          <li key={idx} className="ml-4 list-disc pl-1 py-0.5" dangerouslySetInnerHTML={{ __html: lineFormatted.substring(1).trim() }} />
        );
      }
      return (
        <p key={idx} className="min-h-[1rem] leading-relaxed" dangerouslySetInnerHTML={{ __html: lineFormatted }} />
      );
    });
  };

  return (
    <div className="h-[75vh] flex flex-col bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">Avon Smart AI Assistant</h3>
            <span className="text-[9.5px] font-semibold text-emerald-600 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping mr-1" />
              <span>Online & Role-Aware</span>
            </span>
          </div>
        </div>
        <div className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 text-brand-650 dark:text-brand-400 rounded-lg text-[10px] font-bold flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-brand-500" />
          <span>Role: {user?.role}</span>
        </div>
      </div>

      {/* Message History Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={idx} className={`flex items-start space-x-2.5 ${!isAI ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`p-1.5 rounded-lg shrink-0 border ${
                isAI 
                  ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-900' 
                  : 'bg-slate-100 dark:bg-enterprise-800 border-slate-200 dark:border-enterprise-750'
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4 text-slate-500" />}
              </div>

              {/* Message block */}
              <div className={`p-4 rounded-2xl max-w-lg text-xs space-y-1 ${
                isAI
                  ? msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-400 rounded-tl-none'
                    : 'bg-slate-50 dark:bg-enterprise-950 border border-slate-100 dark:border-enterprise-850 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  : 'bg-brand-600 text-white rounded-tr-none shadow-sm'
              }`}>
                <div className="space-y-1 leading-relaxed">
                  {formatReplyText(msg.text)}
                </div>
                <span className={`text-[8px] block text-right font-mono mt-1 ${isAI ? 'text-slate-400' : 'text-brand-200'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts & Chat inputs (Sticky Footer) */}
      <div className="p-4 border-t border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 shrink-0 space-y-3">
        {/* Suggested prompts list */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map(sug => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="px-3 py-1 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold hover:border-brand-500 hover:text-brand-600 transition"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask AI about status, support tickets, services, process..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-grow px-3 py-2.5 text-sm bg-white dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-855 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputText}
            className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white rounded-lg transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
