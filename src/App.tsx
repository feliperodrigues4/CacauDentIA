/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Stethoscope, 
  Pill, 
  BookOpen, 
  Search, 
  ClipboardCheck,
  ChevronRight,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  BarChart3,
  MessageSquare,
  CalendarDays,
  Users,
  Moon,
  Sun
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { sendMessage } from './lib/gemini';
import { OdontoDashboard } from './components/OdontoDashboard';
import { OdontoCalendar } from './components/OdontoCalendar';
import { PatientManagement } from './components/PatientManagement';
import ScientificArticles from './components/ScientificArticles';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

type ViewMode = 'chat' | 'dashboard' | 'calendar' | 'patients' | 'articles';

const QUICK_ACTIONS = [
  { id: 'prescricao', label: 'Protocolo de Prescrição', icon: Pill, color: 'bg-blue-100 text-blue-700' },
  { id: 'diagnostico', label: 'Auxílio Diagnóstico', icon: Stethoscope, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'artigo', label: 'Resumo Científico', icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
  { id: 'biosseguranca', label: 'Biossegurança', icon: ClipboardCheck, color: 'bg-orange-100 text-orange-700' },
];

export default function App() {
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: `${getGreeting()}, Dr(a). Sou a **Cacau Dent.IA**, sua assistente virtual especializada em odontologia. Como posso auxiliar no seu consultório hoje? Podemos discutir um caso clínico, revisar uma prescrição ou explorar a literatura recente.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, viewMode]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await sendMessage(chatHistory);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || 'Desculpe, ocorreu um erro ao processar sua solicitação.'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: 'Ocorreu um erro técnico. Por favor, verifique sua conexão ou tente novamente mais tarde.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (id: string, label: string) => {
    let prompt = `Gostaria de assistência com: ${label}.`;
    
    if (id === 'diagnostico') {
      prompt = `Preciso de auxílio com um diagnóstico clínico. Por favor, me oriente sobre as informações necessárias para avaliarmos as hipóteses diagnósticas e o diagnóstico diferencial deste caso.`;
    } else if (id === 'prescricao') {
      prompt = `Preciso revisar um protocolo de prescrição medicamentosa. Quais informações você precisa para me ajudar a definir a melhor conduta terapêutica?`;
    }
    
    handleSend(prompt);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-clinical-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-clinical-200 dark:shadow-clinical-900/20">
                <Bot size={24} />
              </div>
              <h1 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">Cacau Dent.IA</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-6 pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Navegação</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setViewMode('chat'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    viewMode === 'chat' ? "bg-clinical-50 dark:bg-clinical-900/20 text-clinical-700 dark:text-clinical-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <MessageSquare size={18} className={cn(viewMode === 'chat' ? "text-clinical-600 dark:text-clinical-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-sm font-semibold">Chat Clínico</span>
                </button>
                <button
                  onClick={() => { setViewMode('dashboard'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    viewMode === 'dashboard' ? "bg-clinical-50 dark:bg-clinical-900/20 text-clinical-700 dark:text-clinical-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <BarChart3 size={18} className={cn(viewMode === 'dashboard' ? "text-clinical-600 dark:text-clinical-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-sm font-semibold">Dashboard</span>
                </button>
                <button
                  onClick={() => { setViewMode('articles'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    viewMode === 'articles' ? "bg-clinical-50 dark:bg-clinical-900/20 text-clinical-700 dark:text-clinical-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <BookOpen size={18} className={cn(viewMode === 'articles' ? "text-clinical-600 dark:text-clinical-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-sm font-semibold">Artigos Científicos</span>
                </button>
                <button
                  onClick={() => { setViewMode('calendar'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    viewMode === 'calendar' ? "bg-clinical-50 dark:bg-clinical-900/20 text-clinical-700 dark:text-clinical-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <CalendarDays size={18} className={cn(viewMode === 'calendar' ? "text-clinical-600 dark:text-clinical-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-sm font-semibold">Agenda Clínica</span>
                </button>
                <button
                  onClick={() => { setViewMode('patients'); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    viewMode === 'patients' ? "bg-clinical-50 dark:bg-clinical-900/20 text-clinical-700 dark:text-clinical-400" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Users size={18} className={cn(viewMode === 'patients' ? "text-clinical-600 dark:text-clinical-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-sm font-semibold">Gestão de Pacientes</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Ações Rápidas</p>
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      setViewMode('chat');
                      handleQuickAction(action.id, action.label);
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
                  >
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", action.color)}>
                      <action.icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-clinical-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Configurações</p>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-clinical-700">Tema {isDarkMode ? 'Claro' : 'Escuro'}</span>
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Sobre a Cacau</p>
              <div className="bg-clinical-50 dark:bg-clinical-900/20 rounded-2xl p-4 border border-clinical-100 dark:border-clinical-800/50">
                <p className="text-xs text-clinical-800 dark:text-clinical-300 leading-relaxed">
                  Cacau Dent.IA: Sua assistente virtual especializada, trazendo ciência e prática para o dia a dia do seu consultório.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => {
                setMessages([{
                  id: Date.now().toString(),
                  role: 'model',
                  content: 'Novo atendimento iniciado. Como posso ajudar agora, doutor?'
                }]);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-white transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              Novo Chat
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">Assistente Clínico</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expert em Odontologia Ativo</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <div className="px-3 py-1 bg-clinical-100/50 dark:bg-clinical-900/20 border border-clinical-200 dark:border-clinical-800 rounded-full flex items-center gap-2">
                <Sparkles size={14} className="text-clinical-600 dark:text-clinical-400" />
                <span className="text-xs font-medium text-clinical-700 dark:text-clinical-300 italic">Ciência Aplicada</span>
             </div>
          </div>
        </header>

        {/* Chat Area / Dashboard */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8"
        >
          {viewMode === 'dashboard' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto w-full"
            >
              <OdontoDashboard onViewArticles={() => setViewMode('articles')} />
            </motion.div>
          ) : viewMode === 'calendar' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-6xl mx-auto w-full h-full flex flex-col"
            >
              <OdontoCalendar />
            </motion.div>
          ) : viewMode === 'patients' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full max-w-7xl mx-auto"
            >
              <PatientManagement />
            </motion.div>
          ) : viewMode === 'articles' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-6xl mx-auto w-full h-full flex flex-col"
            >
              <ScientificArticles onSummarize={(title, category) => {
                const prompt = `Por favor, faça um resumo conciso e baseado em evidências sobre o tema "${title}"${category ? ` (Categoria: ${category})` : ''}. Foque em pontos práticos para aplicação clínica na odontologia.`;
                handleSend(prompt);
                setViewMode('chat');
              }} />
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={cn(
                    "flex gap-4 max-w-4xl mx-auto",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm",
                    message.role === 'user' ? "bg-slate-700 dark:bg-slate-800 text-white" : "bg-clinical-600 text-white"
                  )}>
                    {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col space-y-2 max-w-[85%] sm:max-w-[75%]",
                    message.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 md:p-5 rounded-2xl shadow-sm border",
                      message.role === 'user' 
                        ? "bg-clinical-600 text-white border-clinical-700 rounded-tr-none" 
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-800 rounded-tl-none"
                    )}>
                      <div className={cn(
                        "markdown-body prose prose-slate dark:prose-invert max-w-none",
                        message.role === 'user' && "text-white prose-invert"
                      )}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {message.role === 'user' ? 'Você' : 'Mestra Cacau Dent.IA'}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 max-w-4xl mx-auto"
                >
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm bg-clinical-600 text-white">
                    <Bot size={20} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-clinical-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-clinical-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-clinical-400 rounded-full animate-bounce" />
                    <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500 italic">Analisando com Cacau Dent.IA...</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Input Area (Only for chat) */}
        {viewMode === 'chat' && (
          <div className="p-6 md:p-8 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50 dark:via-slate-950 to-transparent">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-clinical-400/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
              
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden focus-within:border-clinical-400 transition-all">
                <div className="pl-5 text-slate-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre um caso, medicamento ou técnica..."
                  className="flex-1 py-5 px-4 text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  disabled={!input.trim() || isLoading}
                  onClick={() => handleSend()}
                  className={cn(
                    "mr-2 p-3 rounded-xl transition-all",
                    input.trim() && !isLoading 
                      ? "bg-clinical-600 text-white hover:bg-clinical-700 shadow-md shadow-clinical-200" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
              
              <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-[0.2em]">
                Uso exclusivo profissional • Suporte à decisão odontológica
              </p>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
