import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { ChatSession, ChatMessage } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/chat/FileUpload';
import { KnowledgeBase } from '../components/chat/KnowledgeBase';
import { useAppContext } from '../hooks/useAppContext';
import { 
  Plus, MessageSquare, Scale, Loader, Send, Paperclip, 
  FileText, ShieldCheck, HelpCircle, ChevronLeft, ChevronRight,
  Database
} from 'lucide-react';

interface ChatPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useAppContext();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
  
  const [messageInput, setMessageInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [kbOpen, setKbOpen] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadSessionsData = async () => {
    if (!user) return;
    try {
      const data = await api.getSessions(user.id);
      setSessions(data);
      if (data.length > 0 && !currentSession) {
        const detailed = await api.getSession(data[0].id);
        setCurrentSession(detailed);
      } else if (data.length === 0) {
        await handleNewSession();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessionsData();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isSending]);

  const handleSelectSession = async (sessionId: string) => {
    try {
      const detailed = await api.getSession(sessionId);
      setCurrentSession(detailed);
      setAttachedFiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewSession = async () => {
    if (!user) return;
    try {
      const title = language === 'uz' ? 'Yangi Tahlil Holati' : 'Новое дело для анализа';
      const newSess = await api.createSession(user.id, title);
      setSessions(prev => [newSess, ...prev]);
      setCurrentSession(newSess);
      setAttachedFiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentSession || isSending) return;
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    const textToSend = messageInput.trim();
    const attachmentsPayload = attachedFiles.map(f => f.name);

    setMessageInput('');
    setAttachedFiles([]);
    setIsSending(true);

    try {
      const updatedSess = await api.sendMessage(currentSession.id, textToSend, attachmentsPayload);
      setCurrentSession(updatedSess);
      
      setSessions(prev => prev.map(s => s.id === updatedSess.id ? updatedSess : s));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (fileData: { name: string; type: string; base64: string; size: number }) => {
    if (!currentSession) return;
    try {
      const savedFile = await api.uploadFile(currentSession.id, fileData.name, fileData.type, fileData.size, fileData.base64);
      setAttachedFiles(prev => [...prev, savedFile]);
    } catch (err) {
      const errAlert = language === 'uz' ? 'Fayl yuklashda xatolik yuz berdi: ' : 'Ошибка при загрузке файла: ';
      alert(errAlert + (err as Error).message);
    }
  };

  const handleGenerateReport = async () => {
    if (!currentSession) return;

    setReportLoading(true);
    try {
      const report = await api.generateReport(currentSession.id);
      setTimeout(() => {
        setReportLoading(false);
        onNavigate('report', { reportId: report.id });
      }, 2500);
    } catch (err: any) {
      setReportLoading(false);
      const errMessage = err.message || '';
      const isLimitError = errMessage.includes('PLUS') || errMessage.includes('PRO') || errMessage.includes('limit') || errMessage.includes('tarif');
      
      if (isLimitError) {
        const confirmMsg = language === 'uz'
          ? `${errMessage}\n\nKattaroq imkoniyatlar, cheksiz tahlillar yoki professional mediatorlar tahlili uchun tarif rejangizni yangilashni istaysizmi?`
          : `${errMessage}\n\nХотите ли вы обновить ваш тарифный план для доступа к дополнительным возможностям, безлимитному анализу дел или оценке профессиональными медиаторами?`;
        
        const confirmUpgrade = window.confirm(confirmMsg);
        if (confirmUpgrade) {
          onNavigate('pricing');
        }
      } else {
        const errAlert = language === 'uz' ? 'Tahliliy hisobot tayyorlashda xatolik yuz berdi: ' : 'Ошибка при подготовке аналитического отчета: ';
        alert(errAlert + errMessage);
      }
    }
  };

  if (loadingSessions) {
    return (
      <div className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] flex flex-col items-center justify-center min-h-[500px]">
        <Loader className="h-10 w-10 text-[#c9a84c] animate-spin" strokeWidth={1.5} />
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-gray-500">
          {language === 'uz' ? 'Mizan Seanslari Yuklanmoqda...' : 'Сессии Mizan загружаются...'}
        </p>
      </div>
    );
  }

  return (
    <div id="chat_page_layout" className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] flex overflow-hidden relative">
      
      {/* 🔮 Deep Analyzing Modal Overlay */}
      {reportLoading && (
        <div className="absolute inset-0 z-50 bg-[#0a0a1a]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in text_modal">
          <div className="relative">
            <Scale className="h-16 w-16 text-[#c9a84c] animate-bounce mx-auto" />
            <div className="absolute inset-0 border-4 border-dashed border-[#c9a84c]/20 rounded-full animate-spin h-18 w-18 -top-1 -left-1"></div>
          </div>
          <h2 className="font-serif text-2xl font-extrabold text-white mt-8 col_white">
            {language === 'uz' ? 'Adliya Tahlili Boshlandi' : 'Начат юридический анализ'}
          </h2>
          <div className="max-w-md space-y-3 mt-4 text-xs text-gray-400">
            <p className="animate-pulse">{language === 'uz' ? "1. O'zbekiston Fuqarolik kodeksining mos moddalari olinmoqda..." : "1. Извлекаются подходящие статьи Гражданского кодекса..."}</p>
            <p className="animate-pulse text-blue-400">{language === 'uz' ? "2. Sud g'alaba nisbati va da'vo xarajatlari hisoblanmoqda..." : "2. Рассчитываются шансы судебной победы и издержки..."}</p>
            <p className="animate-pulse text-[#c9a84c]">{language === 'uz' ? "3. Sudsiz yechilishi mumkin bo'lgan Mediatsiya variantlari tayyorlanmoqda..." : "3. Подготавливаются варианты медиации без судебного иска..."}</p>
          </div>
        </div>
      )}

      {/* 🗃️ LEFT RAIL: SESSIONS HISTORY CATALOG */}
      <aside
        id="sessions_sidebar"
        className={`${
          sidebarOpen ? 'w-80 border-r border-white/5' : 'w-0 border-none'
        } shrink-0 bg-[#0b0b1a] transition-all duration-300 flex flex-col justify-between overflow-hidden sidebar_container`}
      >
        <div className="flex flex-col h-full">
          {/* New chat generator */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c9a84c] font-bold">{t('chat_sidebar')}</span>
            <Button
              id="sidebar_btn_new_chat"
              onClick={handleNewSession}
              variant="secondary"
              size="sm"
              className="px-2 py-1.5"
            >
              <Plus className="h-4 w-4 mr-1 text-[#c9a84c]" />
              {language === 'uz' ? 'Yangi Holat' : 'Новое дело'}
            </Button>
          </div>

          {/* Session selection index logs */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map((sess) => {
              const isActive = currentSession?.id === sess.id;
              return (
                <button
                  id={`btn_session_${sess.id}`}
                  key={sess.id}
                  onClick={() => handleSelectSession(sess.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-start space-x-2.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#c9a84c]/10 border border-[#c9a84c]/35 text-white shadow-inner'
                      : 'hover:bg-white/5 border border-transparent text-gray-300'
                  }`}
                >
                  <MessageSquare className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${isActive ? 'text-[#c9a84c]' : 'text-gray-500'}`} />
                  <div className="truncate text-xs space-y-0.5">
                    <p className={`font-semibold truncate ${isActive ? 'text-[#c9a84c]' : 'text-white'}`}>{sess.title}</p>
                    <div className="flex items-center space-x-1 text-[9px] text-gray-500 font-mono">
                      <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{sess.status === 'completed' ? (language === 'uz' ? 'Tahlil qilingan' : 'Готов') : (language === 'uz' ? 'Muloqotda' : 'Диалог')}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Toggle button rails */}
      <button
        id="sidebar_toggle_rail"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute bottom-5 left-4 z-40 bg-gray-900 border border-gray-700 text-white rounded-full p-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/30 hidden md:block"
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* 💬 MAIN CHAT FRAME */}
      <main id="chat_main_panel" className="flex-1 flex flex-col h-[calc(100vh-65px)]">
        {currentSession ? (
          <>
            {/* Header: Session info details */}
            <header className="p-4 bg-[#16213e]/20 border-b border-white/5 flex items-center justify-between shadow-sm space-x-2">
              <div className="flex items-center space-x-3 truncate">
                <div className="bg-[#c9a84c]/10 p-1.5 rounded-lg border border-[#c9a84c]/20 text-[#c9a84c] shrink-0">
                  <Scale className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <h2 className="text-xs sm:text-sm font-serif font-bold text-white truncate max-w-[120px] sm:max-w-xs md:max-w-md col_white" title={currentSession.title}>{currentSession.title}</h2>
                  <p className="text-[9px] text-gray-400 font-mono truncate leading-none mt-0.5">
                    {language === 'uz' ? 'Status: ' : 'Статус: '}
                    <span className={currentSession.status === 'completed' ? 'text-green-400' : 'text-blue-400 font-semibold'}>
                      {currentSession.status === 'completed' ? (language === 'uz' ? "Tahlil hisoboti tayyorlangan" : "Аналитический отчет готов") : (language === 'uz' ? "Suhbat va dalillar to'plash" : "Сбор аргументов и фактов")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {/* Custom Vector Database/RAG library Toggle */}
                <Button
                  id="header_btn_kb_toggle"
                  onClick={() => setKbOpen(!kbOpen)}
                  variant="secondary"
                  size="sm"
                  className={`border border-white/5 font-medium transition-all ${kbOpen ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]' : 'text-gray-300 hover:text-white'}`}
                >
                  <Database className={`h-3.5 w-3.5 mr-1.5 ${kbOpen ? 'text-[#c9a84c]' : 'text-gray-400'}`} />
                  {language === 'uz' ? 'RAG Kutubxonasi' : 'Библиотека RAG'}
                </Button>

                {/* Action call to launch Report Generator */}
                <Button
                  id="header_btn_report_generator"
                  onClick={handleGenerateReport}
                  variant="accent"
                  size="sm"
                  className="shadow-md"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-[#c9a84c]" />
                  {t('chat_btn_analyze')}
                </Button>
              </div>
            </header>

            {/* Conversation Messages Grid */}
            <div
              id="message_logs_container"
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            >
              {currentSession.messages.map((message) => {
                const isSystem = message.role === 'system';
                const isUser = message.role === 'user';
                
                if (isSystem) {
                  return (
                    <div id={`msg_${message.id}`} key={message.id} className="max-w-lg mx-auto bg-blue-950/20 border border-blue-900/40 p-3 rounded-lg text-blue-300 text-[11px] leading-relaxed flex items-start space-x-2">
                      <ShieldCheck className="h-4 w-4 text-[#c9a84c] shrink-0 mt-0.5" />
                      <span>{message.content}</span>
                    </div>
                  );
                }

                return (
                  <div
                    id={`msg_${message.id}`}
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} max-w-4xl mx-auto`}
                  >
                    <div className={`flex items-start space-x-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar initials */}
                      <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border font-serif font-bold text-xs ${
                        isUser
                          ? 'bg-[#16213e] border-[#c9a84c]/20 text-white'
                          : 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                      }`}>
                        {isUser ? user?.fullName.charAt(0).toUpperCase() : 'M'}
                      </div>

                      {/* Content block bubble */}
                      <div className={`space-y-1`}>
                        <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow ${
                          isUser
                            ? 'bg-[#c9a84c] text-[#1a1a2e] font-medium rounded-tr-none text_user_msg'
                            : 'bg-[#16213e] text-gray-200 rounded-tl-none border border-gray-800 text_bot_msg'
                        }`}>
                          {message.content}

                          {/* Report Links special button cards inside the bubble */}
                          {message.isReportLink && message.reportId && (
                            <div className="mt-4 pt-3 border-t border-[#c9a84c]/20">
                              <Button
                                id={`chat_block_btn_rep_${message.reportId}`}
                                onClick={() => onNavigate('report', { reportId: message.reportId })}
                                variant="primary"
                                size="sm"
                                fullWidth
                                className="shadow shadow-black/20"
                              >
                                {language === 'uz' ? "Hisobotga O'tish • To'liq Tahlil" : "Перейти к отчету • Полный анализ"}
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Rendering attached file flags */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {message.attachments.map((file, fIdx) => (
                              <span key={fIdx} className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-gray-950/40 text-gray-400 border border-gray-800">
                                <Paperclip className="h-3 w-3 text-[#c9a84c]" />
                                <span className="max-w-[120px] truncate">{file}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className={`text-[9px] text-gray-600 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Dynamic typing indicator when waiting for LLM */}
              {isSending && (
                <div className="flex justify-start max-w-4xl mx-auto animate-pulse">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center font-bold text-xs text-[#c9a84c]">
                      M
                    </div>
                    <div className="bg-[#16213e] border border-gray-800 text-gray-400 text-xs rounded-xl rounded-tl-none py-3 px-4 flex items-center space-x-1.5 bot_indicator">
                      <Loader className="h-3.5 w-3.5 text-[#c9a84c] animate-spin" />
                      <span>{language === 'uz' ? "Mizan AI qonunchilik materiallarini tahlil qilmoqda..." : "Mizan AI анализирует статьи законодательства..."}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom prompt input bar */}
            <footer className="p-4 bg-[#16213e]/30 border-t border-gray-800 space-y-3 input_footer">
              
              {/* Draft file attachment badge previews */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {attachedFiles.map((f, idx) => (
                    <span key={idx} className="inline-flex items-center space-x-1 text-[10px] px-2 py-1 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 rounded-lg">
                      <Paperclip className="h-3 w-3" />
                      <span className="max-w-[150px] truncate">{f.name}</span>
                      <button
                        onClick={() => setAttachedFiles(p => p.filter((_, i) => i !== idx))}
                        className="hover:text-red-400 ml-1 select-none cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-end bg_input_row">
                {/* File Drop Drag Box */}
                <FileUpload onFileUploaded={handleFileUpload} disabled={isSending} />

                {/* Form Input Message */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    id="input_message_prompt"
                    type="text"
                    disabled={isSending}
                    placeholder={t('chat_placeholder')}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-[#101726]/60 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#c9a84c] focus:outline-none transition-colors"
                  />
                  <Button
                    id="btn_chat_send"
                    type="submit"
                    disabled={isSending || (!messageInput.trim() && attachedFiles.length === 0)}
                    size="md"
                    className="px-4.5 rounded-xl shrink-0"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </Button>
                </form>
              </div>
            </footer>

            <footer className="p-2 border-t border-gray-700/50 bg-[#101726]/30 text-center text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              © {new Date().getFullYear()} Mizan AI. {language === 'uz' ? "Qonuniy-texnologik tahlil platformasi." : "Судебно-технологическая платформа анализа."}
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <Scale className="h-12 w-12 text-[#c9a84c] mx-auto animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-white mt-4">{t('chat_empty_state')}</h3>
            <div className="pt-4">
              <Button id="btn_center_new_chat" onClick={handleNewSession}>{t('chat_new_btn')}</Button>
            </div>
          </div>
        )}
      </main>

      {kbOpen && (
        <KnowledgeBase onClose={() => setKbOpen(false)} />
      )}
    </div>
  );
};
