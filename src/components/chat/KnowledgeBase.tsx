import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LibraryDocument } from '../../types';
import { Button } from '../ui/Button';
import { useAppContext } from '../../hooks/useAppContext';
import { 
  Database, RefreshCw, FileText, Search, Info, ShieldCheck, ChevronRight
} from 'lucide-react';

interface KnowledgeBaseProps {
  onClose?: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onClose }) => {
  const { language } = useAppContext();
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testQuery, setTestQuery] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchTested, setSearchTested] = useState<boolean>(false);
  
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const docs = await api.getKbDocuments();
      setDocuments(docs);
    } catch (err: any) {
      console.error(err);
      setErrorText(
        language === 'uz' 
          ? 'Kutubxona hujjatlarini yuklashda xatolik yuz berdi.' 
          : 'Ошибка при загрузке документов библиотеки.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setSearching(true);
    setSearchTested(true);
    try {
      const res = await fetch('/api/kb/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: testQuery.trim() })
      });
      if (res.ok) {
        const matches = await res.json();
        setTestResults(matches);
      } else {
        setTestResults([]);
      }
    } catch (err) {
      console.error(err);
      setTestResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <aside
      id="rag_knowledge_base"
      className="w-96 border-l border-white/5 bg-[#0b0b1a] shrink-0 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full z-20 sidebar_kb"
    >
      <div className="flex flex-col h-full overflow-y-auto">
        
        {/* Header container */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#16213e]/20 header_row">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-[#c9a84c]" />
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#c9a84c] font-bold">
                {language === 'uz' ? 'Bilimlar Bazasi' : 'База Знаний'}
              </span>
              <p className="text-[10px] text-gray-500 uppercase leading-none">
                {language === 'uz' ? 'Vektorli RAG hisobi' : 'Векторная система RAG'}
              </p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-all text_close_btn"
              title={language === 'uz' ? 'Yopish' : 'Закрыть'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Informative Help banner */}
        <div className="p-4 bg-[#c9a84c]/5 border-b border-[#c9a84c]/10 text-[11px] text-gray-400 leading-relaxed space-y-2 help_banner">
          <div className="flex items-center space-x-1.5 text-white font-medium">
            <Info className="h-3.5 w-3.5 text-[#c9a84c]" />
            <span>{language === 'uz' ? 'Qonunlar va Kodekslar Kutubxonasi' : 'Библиотека Кодексов и Законов'}</span>
          </div>
          <p>
            {language === 'uz' 
              ? "Ushbu bo'limda tizim administratorlari tomonidan yuklangan rasmiy O'zbekiston Respublikasi Kodekslari, Qonunlari hamda Nizomlari joylashgan."
              : "В данном разделе находятся официальные Кодексы, Законы и Нормативно-правовые акты Республики Узбекистан, предварительно загруженные для работы ИИ."}
          </p>
          <p className="text-[#c9a84c]/80 text-[10px] font-mono leading-tight">
            {language === 'uz' 
              ? "Ma'lumotlar avtomatik ravishda gemini-embedding-2-preview yordamida vektor shakliga o'tkazilgan va sun'iy idrok tahliliga kiritilgan (RAG v2)."
              : "Информация автоматически преобразована в векторный вид с использованием gemini-embedding-2-preview и интегрирована в ИИ-анализ (RAG v2)."}
          </p>
        </div>

        {/* Administration Info banner */}
        <div className="p-4 border-b border-white/5 bg-[#16213e]/10 space-y-2 text-[11px] info_note">
          <h3 className="font-mono uppercase tracking-wider text-[#c9a84c] text-[10px] font-bold">
            {language === 'uz' ? "Ma'muriyat Eslatmasi" : "Заметка Администратора"}
          </h3>
          <div className="p-3.5 rounded-xl border border-[#c9a84c]/10 bg-[#131124] text-gray-300 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-white">
              {language === 'uz' ? '📑 Yangi qonun qo\'shish qanday bo\'ladi?' : '📑 Как добавить законы?'}
            </p>
            <p className="text-gray-400 text-[10px] desc1">
              {language === 'uz' 
                ? "Tizim egalari qonun / nusxa PDF yoki TXT fayllarini loyihaning data/datasets/ papkasiga qo'shishlari kifoya. Server ishga tushganda ularni avtomatik o'qiydi."
                : "Администраторы могут просто скопировать новые PDF или TXT файлы законов в папку data/datasets/. Сервер автоматически проиндексирует их при запуске."}
            </p>
            <p className="font-semibold text-white pt-1">
              {language === 'uz' ? '📎 Mijozlar qanday hujjat yuklashadi?' : '📎 Как клиенты загружают файлы?'}
            </p>
            <p className="text-gray-400 text-[10px] desc2">
              {language === 'uz' 
                ? "Mijozlar o'z ishlariga doir o'z shaxsiy hujjatlari, shartnomalari yoki da'vo rasm-fayllarini to'g'ridan-to'g'ri Suhbat (Chat) oynasidagi biriktirish belgisi orqali yuklashadi!"
                : "Клиенты загружают документы, относящиеся к их делу (договоры, квитанции, фотографии улик), прямо через иконку скрепки в чате для персонального анализа!"}
            </p>
          </div>
        </div>

        {/* Uploaded files catalog */}
        <div className="p-4 space-y-3 border-b border-white/5 bg-[#16213e]/5 animate-fade-in list_container">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold">
              {language === 'uz' ? `Faol Qonunlar Ro'yxati (${documents.length})` : `Список Активных Законов (${documents.length})`}
            </h3>
            <button 
              onClick={loadDocuments} 
              className="text-[10px] text-[#c9a84c] hover:underline flex items-center refresh_btn"
              disabled={loading}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} /> {language === 'uz' ? 'Yangilash' : 'Обновить'}
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-500 flex flex-col justify-center items-center">
              <RefreshCw className="h-5 w-5 text-[#c9a84c] animate-spin mb-2" />
              {language === 'uz' ? "Qonunlar ro'yxati o'qilmoqda..." : "Список кодексов считывается..."}
            </div>
          ) : documents.length === 0 ? (
            <div className="py-6 rounded-xl border border-white/5 bg-[#131326] text-center text-xs text-gray-500 p-2 space-y-1 fallback_box">
              <Database className="h-6 w-6 text-gray-700 mx-auto" />
              <p>{language === 'uz' ? "Hozircha tizimga hech qanday qonun yuklanmagan." : "Пока в систему не загружено ни одного закона."}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-3 rounded-lg bg-[#131326] border border-white/5 text-xs flex items-center justify-between hover:border-[#c9a84c]/20 transition-all duration-200 doc_element"
                >
                  <div className="flex items-start space-x-2.5 truncate max-w-full">
                    <FileText className="h-4.5 w-4.5 text-[#c9a84c] shrink-0 mt-0.5" />
                    <div className="truncate space-y-0.5">
                      <p className="font-semibold text-white truncate max-w-[220px]" title={doc.name}>
                        {doc.name}
                      </p>
                      <div className="flex items-center space-x-2 text-[9px] text-gray-500 font-mono">
                        <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">
                          {doc.chunkCount} {language === 'uz' ? 'vektor parchasi' : 'векторных частей'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Semantic Query search tester drawer */}
        <div className="p-4 space-y-3 test_block">
          <div className="flex items-center space-x-1">
            <Search className="h-4 w-4 text-[#c9a84c]" />
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold">
              {language === 'uz' ? 'Vektorli Qidiruv Testi' : 'Тест Семантического Поиска'}
            </h3>
          </div>
          
          <form onSubmit={handleTestSearch} className="flex space-x-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder={language === 'uz' ? "Masalan, aliment stavkalari, jarimalar..." : "Например, алименты, размер штрафов..."}
              className="flex-grow text-xs bg-[#131326] border border-white/5 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#c9a84c]"
              disabled={documents.length === 0}
            />
            <Button
              type="submit"
              disabled={documents.length === 0 || searching || !testQuery.trim()}
              size="sm"
              className="py-1.5 px-3 btn_search_action"
            >
              {language === 'uz' ? 'Qidirish' : 'Поиск'}
            </Button>
          </form>

          {searching ? (
            <div className="py-4 text-center text-xs text-gray-500 load_search">
              <RefreshCw className="h-4 w-4 animate-spin inline mr-2 text-[#c9a84c]" />
              {language === 'uz' ? 'Semantik mosliklar hisoblanmoqda...' : 'Семантическое сопоставление...'}
            </div>
          ) : searchTested && (
            <div className="space-y-2.5 results_block">
              <p className="text-[10px] text-gray-500 font-mono">
                {language === 'uz' ? `Eng yaqin mosliklar (${testResults.length}):` : `Семантические сопоставления (${testResults.length}):`}
              </p>
              
              {testResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-600 bg-black/10 rounded-lg">
                  {language === 'uz' ? 'Hech qanday mos tahlil segmenti topilmadi.' : 'Совпадений в векторах не найдено.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {testResults.map((res, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black/20 border border-white/[0.02] text-[11px] leading-relaxed space-y-1.5 single_match">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-[#c9a84c] font-semibold truncate max-w-[150px]">
                          📂 {res.chunk.docName}
                        </span>
                        <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 px-1 rounded animate-pulse">
                          {(res.score * 100).toFixed(1)}% {language === 'uz' ? "o'xshashlik" : "совпадение"}
                        </span>
                      </div>
                      <p className="text-gray-300 italic">
                        "{res.chunk.text.length > 150 ? res.chunk.text.slice(0, 150) + '...' : res.chunk.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="p-3 border-t border-white/5 bg-black/20 text-center text-[10px] text-gray-500 flex items-center justify-center space-x-1 font-mono footer_text">
        <ShieldCheck className="h-3.5 w-3.5 text-[#c9a84c]" />
        <span>
          {language === 'uz' 
            ? "RAG jarayoni barcha shifrlashga muvofiq maxfiydir" 
            : "Векторизация RAG зашифрована и конфиденциальна"}
        </span>
      </div>
    </aside>
  );
};
