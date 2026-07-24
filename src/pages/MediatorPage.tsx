import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { 
  Scale, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  HelpCircle,
  Activity,
  UserCheck
} from 'lucide-react';

interface MediatorPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MediatorPage: React.FC<MediatorPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useAppContext();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [mediatorOpinion, setMediatorOpinion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [filterTariff, setFilterTariff] = useState<string>('ALL'); // ALL, MAX, PRO, PLUS

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const allReports = await api.getAllReports();
      setReports(allReports);
      if (allReports.length > 0) {
        setSelectedReport(allReports[0]);
        setMediatorOpinion(allReports[0].mediator_xulosasi || '');
      }
    } catch (err: any) {
      setErrorText(err.message || (language === 'uz' ? "Hisobotlarni yuklashda xatolik yuz berdi" : "Ошибка при загрузке отчетов"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (rep: any) => {
    setSelectedReport(rep);
    setMediatorOpinion(rep.mediator_xulosasi || '');
    setSuccessText(null);
    setErrorText(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSubmitting(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const updated = await api.updateMediatorReview(selectedReport.id, mediatorOpinion);
      setSuccessText(language === 'uz' ? "Mediator xulosasi muvaffaqiyatli saqlandi!" : "Заключение медиатора успешно сохранено!");

      setReports(prev => prev.map(r => r.id === updated.id ? { ...r, mediator_xulosasi: mediatorOpinion } : r));
      setSelectedReport(prev => ({ ...prev, mediator_xulosasi: mediatorOpinion }));
    } catch (err: any) {
      setErrorText(err.message || (language === 'uz' ? "Xulosani saqlashda xatolik yuz berdi" : "Ошибка при сохранении заключения"));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterTariff === 'ALL') return true;
    return r.user_tariff === filterTariff;
  });

  return (
    <div id="mediator_dashboard" className="flex-1 bg-[#05050f] text-[#e0e0e0] flex flex-col min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Visual background enhancements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="max-w-7xl w-full mx-auto px-4 py-8 flex-1 flex flex-col space-y-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="bg-amber-500/10 p-1.5 rounded border border-amber-500/30">
                <Scale className="h-5 w-5 text-[#c9a84c]" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#c9a84c] font-bold">
                {language === 'uz' ? 'PROFESSIONAL MEDIATOR PANEL' : 'ПРОФЕССИОНАЛЬНАЯ ПАНЕЛЬ МЕДИАТОРА'}
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-white font-black tracking-tight col_white">
              {language === 'uz' ? 'Mizan Sud-Mediatsiya Ishlarini Tahlil Qilish' : 'Анализ Судебных Дел Mizan'}
            </h1>
            <p className="text-xs text-gray-400">
              {language === 'uz' 
                ? "Mijozlarimizning sud ishlari tafsilotlarini tahlil qiling hamda yuridik xulosalaringizni biriktiring."
                : "Анализируйте детали судебных дел клиентов и прикрепляйте ваши экспертные предложения по примирению."}
            </p>
          </div>

          <div className="mt-4 md:mt-0 bg-[#0f1426]/80 p-3 rounded-xl border border-gray-800 flex items-center space-x-3.5 bg_user_badge">
            <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
              <UserCheck className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono">{language === 'uz' ? 'XAYRLI VAQT, MEDIATOR' : 'ДОБРЫЙ ДЕНЬ, МЕДИАТОР'}</p>
              <h4 className="text-xs font-bold text-white">{user?.fullName || "A. Sharipov"}</h4>
            </div>
          </div>
        </div>

        {errorText && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorText}
          </div>
        )}

        {successText && (
          <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/30 text-green-400 text-xs font-semibold text-center">
            {successText}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
            <Activity className="h-10 w-10 text-[#c9a84c] animate-pulse" />
            <p className="text-xs font-mono text-gray-400">{language === 'uz' ? "Barcha hisobot ma'lumotlari yuklanmoqda..." : "Загружаются отчеты и споры..."}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-[#c9a84c]/60" />
            <h3 className="font-serif text-lg text-white font-bold">{t('med_empty')}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            
            {/* Left Sidebar: Case list */}
            <div className="lg:col-span-4 space-y-4 h-full">
              
              {/* Tariff Filter Segment */}
              <div className="bg-[#0f1426]/60 p-2 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono bg_filter">
                <p className="text-gray-400 font-bold px-2">{language === 'uz' ? 'TARIF FILTER:' : 'ФИЛЬТР:'}</p>
                <div className="flex space-x-1">
                  {['ALL', 'MAX', 'PRO', 'PLUS'].map((tVal) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setFilterTariff(tVal)}
                      className={`px-2.5 py-1 rounded transition-all text-[10px] font-bold ${
                        filterTariff === tVal
                          ? 'bg-[#c9a84c] text-[#05050f]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Items List */}
              <div className="space-y-3 max-h-[500px] lg:max-h-[650px] overflow-y-auto pr-1">
                {filteredReports.map((rep) => {
                  const isSelected = selectedReport?.id === rep.id;
                  const hasReview = !!rep.mediator_xulosasi;
                  
                  let badgeColor = "border-gray-500/50 text-gray-400 bg-gray-950/20";
                  if (rep.user_tariff === 'MAX') badgeColor = "border-red-500/40 text-red-500 bg-red-950/30";
                  if (rep.user_tariff === 'PRO') badgeColor = "border-amber-500/30 text-amber-500 bg-[#c9a84c]/10";
                  if (rep.user_tariff === 'PLUS') badgeColor = "border-blue-500/30 text-blue-400 bg-blue-950/25";

                  return (
                    <button
                      key={rep.id}
                      onClick={() => handleSelectReport(rep)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col space-y-2.5 relative group ${
                        isSelected 
                          ? 'border-[#c9a84c] bg-[#121828]/90 shadow-md shadow-[#c9a84c]/5' 
                          : 'border-gray-900 bg-[#0a0a1a]/60 hover:bg-[#0f1426]/65 hover:border-gray-800'
                      }`}
                    >
                      {/* Left visual strip */}
                      {rep.user_tariff === 'MAX' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
                          {rep.user_tariff} {t('nav_tariff_suffix')}
                        </span>
                        
                        {hasReview ? (
                          <span className="flex items-center space-x-1 text-[8.5px] font-bold text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{t('med_reviewed')}</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-[8.5px] font-bold text-amber-500 animate-pulse">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>{t('med_not_reviewed')}</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#c9a84c] transition-colors col_white">
                          {rep.sud_mavzusi}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1 font-mono">
                          <span>{language === 'uz' ? "Da'vogar:" : "Истец:"}</span>
                          <span className="text-gray-300 font-sans font-semibold max-w-[150px] truncate">{rep.user_fullName}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono border-t border-gray-900/60 pt-2.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-bold text-[#c9a84c]">
                          <span>{language === 'uz' ? 'Ehtimollik:' : 'Шанс:'}</span>
                          <span>{rep.yutish_ehtimoli}%</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Action review details */}
            <div className="lg:col-span-8 space-y-6">
              {selectedReport ? (
                <>
                  {/* Detailed Analysis Box */}
                  <Card id="mediator_analysis_detail" className="p-6 md:p-8 space-y-6 bg_card">
                    
                    {/* Header line info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] bg-red-950/40 text-red-400 border border-red-500/30 px-2 py-0.2 rounded-full font-mono">
                            {selectedReport.user_tariff} HIGH TIER CASE
                          </span>
                          <span className="text-xs text-gray-500 font-mono">• ID: {selectedReport.id.slice(-6)}</span>
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-black text-white leading-tight col_white">
                          {selectedReport.sud_mavzusi}
                        </h2>
                      </div>

                      <div className="text-left md:text-right font-mono text-xs">
                        <p className="text-gray-500 uppercase text-[9px]">{language === 'uz' ? 'Mijoz ma\'lumoti' : 'Клиент'}</p>
                        <p className="text-white font-sans font-bold text-sm mt-0.5">{selectedReport.user_fullName}</p>
                        <p className="text-[#c9a84c] text-[11px] font-sans mt-0.5">{selectedReport.user_email}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Holat tavsifi */}
                      <div className="bg-[#0b0f19] p-4.5 rounded-xl border border-gray-800 text-left space-y-1.5 desc_box">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-mono">{language === 'uz' ? '1. Mijoz bergan nizo holati' : '1. Описание спора клиентом'}</h4>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-justify">
                          {selectedReport.holat_tavsifi}
                        </p>
                      </div>

                      {/* Sud jarayoni va ehtimol */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#0d1222]/80 p-4 rounded-xl border border-gray-800 text-left space-y-1 metric_box">
                          <span className="text-[10px] text-gray-500 font-mono block uppercase">{language === 'uz' ? '2. Yutish Ehtimoli' : '2. Шанс победы'}</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="text-lg font-black text-white">{selectedReport.yutish_ehtimoli}% ehtimol</span>
                          </div>
                        </div>

                        <div className="bg-[#0d1222]/80 p-4 rounded-xl border border-gray-800 text-left space-y-1 metric_box2">
                          <span className="text-[10px] text-gray-500 font-mono block uppercase">{language === 'uz' ? '3. Ketadigan Muddat' : '3. Сроки процесса'}</span>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-[#c9a84c]" />
                            <span className="text-sm font-bold text-white">
                              {selectedReport.taxminiy_muddat.min} - {selectedReport.taxminiy_muddat.max} {selectedReport.taxminiy_muddat.currency === 'oy' ? (language === 'uz' ? 'oy' : 'мес.') : selectedReport.taxminiy_muddat.currency}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#0d1222]/80 p-4 rounded-xl border border-gray-800 text-left space-y-1 metric_box3">
                          <span className="text-[10px] text-gray-500 font-mono block uppercase">{language === 'uz' ? '4. Taxminiy Sud Xarajati' : '4. Судебные расходы'}</span>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-bold text-white">
                              {parseInt(selectedReport.taxminiy_xarajat.min).toLocaleString()} UZS {language === 'uz' ? 'dan' : '+'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Qonuniy asoslar */}
                      {selectedReport.qonuniy_asoslar && selectedReport.qonuniy_asoslar.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-mono">{language === 'uz' ? '5. Sun\'iy intellekt topgan qonunlar (RAG)' : '5. Статьи законодательства (RAG ИИ)'}</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.qonuniy_asoslar.map((l: string, i: number) => (
                              <span key={i} className="text-xs bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
                                {l}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Yutug-yutkaz_sabablari */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-950/5 p-4 rounded-xl border border-green-900/10 space-y-1.5 text-left">
                          <span className="text-[10px] text-green-400 font-bold block uppercase tracking-wider font-mono">{language === 'uz' ? 'G\'alaba Sabablari (Dalillar)' : 'Преимущества (Доказательства и доводы)'}</span>
                          <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                            {selectedReport.yutish_sabablari.map((s: string, idx: number) => (
                              <li key={idx} className="leading-snug">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-950/5 p-4 rounded-xl border border-red-900/10 space-y-1.5 text-left">
                          <span className="text-[10px] text-red-400 font-bold block uppercase tracking-wider font-mono">{language === 'uz' ? 'Kutilayotgan xatarlar' : 'Риски и слабые стороны'}</span>
                          <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                            {selectedReport.utkazish_sabablari.map((s: string, idx: number) => (
                              <li key={idx} className="leading-snug">{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Alternativ yechim */}
                      <div className="bg-amber-950/5 p-4.5 rounded-xl border border-[#c9a84c]/10 text-left space-y-2 alternative_banner">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-[#c9a84c]" />
                          <span className="text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider">{t('rep_alt_section')}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{selectedReport.alternativ_yechim.tavsiya}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{selectedReport.alternativ_yechim.sabab}</p>
                        <p className="text-xs font-mono text-[#c9a84c]">{t('rep_alt_saves')}: <b>{selectedReport.alternativ_yechim.taxminiy_tejash}</b></p>
                      </div>

                    </div>

                    {/* Submit Review Form */}
                    <div className="border-t border-gray-800/80 pt-6 space-y-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="bg-[#c9a84c] text-black p-1.5 rounded-lg">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{t('rep_mediator_review')}</h3>
                          <p className="text-[11px] text-gray-500">
                            {language === 'uz' ? 'Kiritilgan xulosa mijozning tahlili hisobotida darhol aks etadi.' : 'Ваше заключение сразу отобразится у клиента в его отчете.'}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <textarea
                          id="mediator_opinion_textarea"
                          rows={4}
                          required
                          value={mediatorOpinion}
                          onChange={(e) => setMediatorOpinion(e.target.value)}
                          placeholder={t('rep_mediator_write')}
                          className="w-full p-4 rounded-xl border border-gray-800 bg-[#080c16]/80 text-[#e0e0e0] leading-relaxed text-xs sm:text-sm placeholder-gray-600 focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/30 transition-all font-serif italic"
                        ></textarea>

                        <div className="flex justify-end">
                          <Button
                            id="submit_review_btn"
                            type="submit"
                            disabled={submitting}
                            className="bg-[#c9a84c] text-black font-semibold hover:bg-opacity-90 active:scale-95 transition-all text-sm px-6 py-2"
                          >
                            {submitting ? (language === 'uz' ? "Saqlanmoqda..." : "Сохранение...") : t('rep_mediator_save')}
                          </Button>
                        </div>
                      </form>
                    </div>

                  </Card>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-gray-800 rounded-2xl bg-[#0a0a1a]/40">
                  <HelpCircle className="h-10 w-10 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-400">
                    {language === 'uz' ? 'Tafsilotini ko\'rish va xulosa yozish uchun chap tarafdagi ro\'yxatdan bironta holatni tanlang.' : 'Выберите спор из списка слева для написания заключения.'}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
