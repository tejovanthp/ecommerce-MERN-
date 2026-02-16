
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Salutations. I am your mycart Crimson Pro AI. How may I elevate your luxury shopping experience today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const historyRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const apiKey = process.env.API_KEY;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "System Offline: The Crimson AI link is missing an API_KEY. Please configure your environment variables to activate this feature." 
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: "You are 'Crimson Pro AI', the elite luxury concierge for 'mycart' e-commerce. Your tone is sophisticated, professional, and slightly futuristic. Always highlight our 'Crimson Excellence' culture: Free global logistics for elite members and our signature 7-day White-Glove returns.",
          temperature: 0.7,
        },
        history: historyRef.current
      });

      const response = await chat.sendMessage({ message: userMsg });
      const botText = response.text || "I am currently re-calibrating my neural pathways. Please re-state your request.";
      
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
      
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [{ text: userMsg }] },
        { role: 'model', parts: [{ text: botText }] }
      ];

    } catch (error) {
      console.error("Crimson AI Core Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "A temporary atmospheric interference has disrupted the AI link. Please ensure your API_KEY is valid and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-3xl w-[380px] md:w-[450px] h-[600px] rounded-[3.5rem] shadow-[0_50px_100px_rgba(220,38,38,0.25)] border border-red-100 dark:border-white/10 flex flex-col overflow-hidden mb-6 ring-1 ring-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-slate-950 p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group">
                <i className="fa-solid fa-crown text-yellow-400 text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-[0.2em] flex items-center">
                  Crimson Pro
                  <span className="ml-2 bg-yellow-400 text-red-950 text-[8px] px-1.5 py-0.5 rounded font-black">ACTIVE</span>
                </h3>
                <p className="text-[9px] text-red-100 font-black uppercase tracking-[0.2em] flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  Link Sync Active
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 border border-white/5 transition-colors"
            >
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/50 dark:bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm font-semibold shadow-xl border ${
                  m.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none border-red-500' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border-red-50/50 dark:border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl rounded-tl-none border border-red-50 dark:border-white/5 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Processing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white dark:bg-slate-900 border-t border-red-50 dark:border-white/10 flex items-center space-x-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Inquire about luxury catalog..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-white/5 outline-none px-7 py-5 rounded-[1.8rem] text-sm font-bold placeholder-slate-400 focus:ring-4 focus:ring-red-600/5 disabled:opacity-50 transition-all"
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-red-600 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-500/30 dark:shadow-none disabled:opacity-50 hover:bg-red-700 transition-all active:scale-90"
            >
              <i className="fa-solid fa-arrow-up text-lg"></i>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl group relative border-4 border-white dark:border-slate-800 transition-all duration-300 ${
          isOpen 
          ? 'bg-slate-900 text-white rotate-90 scale-110' 
          : 'bg-red-600 text-white shadow-red-500/40 hover:scale-105 active:scale-95'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-3xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-yellow-500 border-2 border-red-600"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
