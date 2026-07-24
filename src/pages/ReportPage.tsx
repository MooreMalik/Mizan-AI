import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AnalysisReport } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { 
  ChevronLeft, Printer, Scale, Landmark, Calendar, 
  Coins, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldAlert, RefreshCw, Zap
} from 'lucide-react';

interface ReportPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialParams?: any;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onNavigate, initialParams }) => {
  const { user } = useAuth();
  const { t, language } = useAppContext();
  const reportId = initialParams?.reportId;
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setErrorString(language === 'uz' ? 'Hech qanday hisobot ID si taqdim etilmagan!' : 'ID отчета не найден!');
        setLoading(false);
        return;
      }
      try {
        const data = await api.getReport(reportId);
        setReport(data);
      } catch (err: any) {
        setErrorString(err.message || (language === 'uz' ? 'Hisobotni yuklashda xatolik yuz berdi.' : 'Ошибка при загрузке судебного отчета'));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] flex flex-col items-center justify-center min-h-[500px]">
        <RefreshCw className="h-10 w-10 text-[#c9a84c] animate-spin" strokeWidth={1.5} />
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-gray-500">
          {language === 'uz' ? 'Mizan Tahliliy Hisoboti Yuklanmoqda...' : 'Подготовка аналитического отчета Mizan...'}
        </p>
      </div>
    );
  }

  if (errorString || !report) {
    return (
      <div className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg_error_container">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto bg-red-950/20 p-2 rounded-xl border border-red-900/35" />
        <h3 className="font-serif text-lg font-bold text-white mt-4 col_white">
          {language === 'uz' ? "Hisobotni yuklab bo'lmadi" : "Не удалось загрузить отчет"}
        </h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm">{errorString || 'Kutilmagan xatolik'}</p>
        <div className="pt-6">
          <Button id="btn_report_err_back" onClick={() => onNavigate('chat')}>
            {language === 'uz' ? 'AI Konsultatsiyaga qaytish' : 'Вернуться к AI Консультации'}
          </Button>
        </div>
      </div>
    );
  }
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.yutish_ehtimoli / 100) * circumference;

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return 'text-green-400 stroke-green-500';
    if (prob >= 50) return 'text-yellow-400 stroke-yellow-500';
    return 'text-red-400 stroke-red-500';
  };

  return (
    <div id="report_page_wrapper" className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] py-12 px-4 sm:px-6 select-text printing-container relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* 📑 REPORT HEADER / CONTROL BAR */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6 print:hidden">
          <button
            id="btn_report_back_to_chat"
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors back_to_chat"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t('rep_btn_back')}</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto text_btn_group">
            <Button
              id="btn_report_print"
              onClick={handlePrint}
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              {t('rep_btn_print')}
            </Button>
            <Button
              id="btn_report_new_analysis"
              onClick={() => onNavigate('chat')}
              variant="primary"
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              {language === 'uz' ? 'Yangi Tahlil Qilish' : 'Новый анализ'}
            </Button>
          </div>
        </header>

        {/* ⚖️ EMBLEM WATERMARK BRANDING */}
        <div className="flex items-center justify-between border-b border-[#c9a84c]/20 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="bg-[#c9a84c]/10 p-2.5 rounded-xl border border-[#c9a84c]/30 text-[#c9a84c]">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-widest text-white font-extrabold uppercase leading-none">MIZAN</span>
              <p className="text-[10px] text-gray-400 tracking-[0.25em] font-mono mt-0.5 leading-none">PREMIUM AI LEGAL ENGINE</p>
            </div>
          </div>
          <div className="text-right font-mono text-[9px] text-gray-500 space-y-0.5">
            <p>{language === 'uz' ? 'Hujjat raqami:' : 'Номер отчета:'} {report.id.slice(0, 12)}</p>
            <p>
              {language === 'uz' ? 'Sanasi:' : 'Дата:'}{' '}
              {new Date(report.createdAt).toLocaleDateString()}{' '}
              {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* 🍱 BENTO GRID CORE LEGAL ASSESSMENT REPORT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tile 1: Subject of dispute & Case overview */}
          <Card id="report_bento_overview" accented className="md:col-span-2 space-y-4 bg_card">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold">{t('rep_theme')}</span>
              <h2 className="font-serif text-2xl font-bold text-white leading-tight col_white">{report.sud_mavzusi}</h2>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 leading-relaxed space-y-2 border-t border-gray-800 pt-4 text_desc">
              <p className="font-semibold text-gray-300">{t('rep_desc')}:</p>
              <p className="text-justify">{report.holat_tavsifi}</p>
            </div>
          </Card>

          {/* Tile 2: Dynamic Gold-Accent Win Probability Circular Dial */}
          <Card id="report_bento_wheel" className="flex flex-col items-center justify-center p-6 text-center select-none space-y-4 border-[#c9a84c]/25 bg-gradient-to-tr from-[#16213e]/80 to-[#121a30]/80">
            <div className="space-y-1 w-full border-b border-gray-800/80 pb-3">
              <span className="text-[9px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold">{t('rep_win_rate')}</span>
              <p className="text-[10px] text-gray-500 font-serif">{language === 'uz' ? "Da'vo koeffitsiyenti tahlili" : "Оценка судебной перспективы"}</p>
            </div>

            {/* Circular Gauge Graph SVG */}
            <div className="relative h-32 w-32 filter drop-shadow-[0_4px_12px_rgba(201,168,76,0.06)]">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke="#101726"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className={`transition-all duration-1000 ${getProbabilityColor(report.yutish_ehtimoli).split(' ')[1]}`}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Dial text value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-serif font-extrabold ${getProbabilityColor(report.yutish_ehtimoli).split(' ')[0]}`}>
                  {report.yutish_ehtimoli}%
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono mt-0.5">{language === 'uz' ? 'Ijobiy kutilma' : 'Шанс успеха'}</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-gray-300 px-2 leading-relaxed bg-[#101726]/40 py-2 rounded-lg border border-gray-800/80 w-full hover_text">
              {report.yutish_ehtimoli >= 75 
                ? (language === 'uz' ? "Yuqori darajadagi qonuniy dalillar va huquqiy tayanvga ega." : "Высокий уровень законных доказательств и правовой основы.") 
                : report.yutish_ehtimoli >= 50 
                ? (language === 'uz' ? "Nisbatan o'rtacha imkoniyat. Qo'shimcha guvohlar talab qilinishi mumkin." : "Средние шансы на успех. Могут потребоваться дополнительные свидетели.") 
                : (language === 'uz' ? "Sudda yutkazish xavfi yuqori. Tinch mediatsiya kelishuvidan foydalaning!" : "Высокий риск проигрыша дела в суде. Используйте мирную медиацию!")
              }
            </div>
          </Card>

          {/* Tile 3: Key Law Citations (RAG search outcomes) */}
          <Card id="report_bento_laws" className="md:col-span-3 space-y-4 bg_card0">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Landmark className="h-4 w-4 text-[#c9a84c]" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold">{t('rep_articles')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {report.qonuniy_asoslar.map((lawCode, idx) => (
                <div key={idx} className="bg-[#101726]/50 border border-gray-800/80 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#c9a84c]/20 transition-all law_box">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-gradient-to-bl from-[#c9a84c]/5 to-transparent pointer-events-none rounded-bl-3xl"></div>
                  <span className="inline-block text-[10px] font-bold font-mono text-[#c9a84c] tracking-wide border border-[#c9a84c]/20 px-2 py-0.5 rounded bg-[#c9a84c]/5">
                    {language === 'uz' ? `Modda ${idx + 1}` : `Статья ${idx + 1}`}
                  </span>
                  <p className="text-xs font-semibold text-white truncate col_white">{lawCode.split(' - ')[0] || lawCode}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-3 leading-relaxed">
                    {lawCode.split(' - ')[1] || (language === 'uz' ? 'Suhbat tahlili natijasida aniqlangan tegishli huquqiy norma.' : 'Соответствующая правовая норма, определенная в ходе диалога.')}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tile 4: Success Multipliers & Bottlenecks columns */}
          <Card id="report_factors_grid" className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 bg_card1">
            
            {/* Success Indicators */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-400 border-b border-gray-800 pb-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{t('rep_reasons_pro')}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-gray-300 leading-relaxed">
                {report.yutish_sabablari.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="h-5 w-5 rounded bg-green-950/20 text-green-400 border border-green-800/30 flex items-center justify-center font-bold font-mono shrink-0 select-none text-[9px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Negative Indicators */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-400 border-b border-gray-800 pb-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{t('rep_reasons_con')}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-gray-300 leading-relaxed">
                {report.utkazish_sabablari.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="h-5 w-5 rounded bg-red-950/20 text-red-400 border border-red-800/30 flex items-center justify-center font-bold font-mono shrink-0 select-none text-[9px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </Card>

          {/* Tile 5: Cost Estimations & Timeline */}
          <div className="md:col-span-1 space-y-6 flex flex-col">
            
            {/* Timeline Duration Card */}
            <Card id="report_sub_card_duration" className="flex-1 flex flex-col justify-between p-5 text-left border-gray-800/80 bg_card2">
              <div className="flex items-center space-x-2.5">
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400 border border-blue-800/30">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-bold">{t('rep_time_req')}</span>
                  <p className="text-lg font-serif font-bold text-white col_white">
                    {report.taxminiy_muddat.min} — {report.taxminiy_muddat.max} {report.taxminiy_muddat.currency === 'oy' ? (language === 'uz' ? 'oy' : 'мес.') : report.taxminiy_muddat.currency}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed bg-[#101726]/40 p-2.5 rounded-lg border border-gray-800/80 desc_text">
                {language === 'uz' 
                  ? "Mazkur muddat 1-instansiya sud ko'rib chiqishi uchun kutiladi. FPK 201-moddasiga ko'ra ishlarni hal etish o'rtacha normal 1-2 oyni, murakkab ishlarda 3 oygacha muddatni tashkil etishi kutiladi."
                  : "Данный срок ожидается для рассмотрения дела судом первой инстанции. Согласно ГПК, средний срок разрешения спора составляет 1–2 месяца, а в сложных случаях — до 3 месяцев."}
              </p>
            </Card>

            {/* Trial Costs Expense Card */}
            <Card id="report_sub_card_costs" className="flex-1 flex flex-col justify-between p-5 text-left border-gray-800/80 bg_card3">
              <div className="flex items-center space-x-2.5">
                <div className="bg-[#c9a84c]/10 p-2 rounded-xl text-[#c9a84c] border border-[#c9a84c]/20">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-bold">{t('rep_cost_req')}</span>
                  <p className="text-lg font-serif font-bold text-white col_white">
                    {Number(report.taxminiy_xarajat.min).toLocaleString()} — {Number(report.taxminiy_xarajat.max).toLocaleString()} {report.taxminiy_xarajat.currency}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed bg-[#101726]/40 p-2.5 rounded-lg border border-gray-800/80 desc_text2">
                {language === 'uz' 
                  ? "Xarajat tarkibiga da'vogarning Davlat boji stavkalari (4%), advokatlar xizmati hamda ekspertiza xarajatlari kiritilgan bo'lib, sud qarori sizning foydangizga yakunlansa javobgardan undirib olinadi."
                  : "В расходы включены госпошлина со стороны истца (4%), расходы на услуги адвоката и проведение экспертизы, которые при успешном решении суда взыскиваются с ответчика."}
              </p>
            </Card>

          </div>

          {/* Tile 6: Legal process description milestones timeline */}
          <Card id="report_bento_stages" className="md:col-span-2 space-y-4 bg_card_stage">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Sparkles className="h-4 w-4 text-[#c9a84c]" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold">{t('rep_stages')}</span>
            </div>
            
            {/* Timeline Rendering */}
            <div className="space-y-4 pl-2 pt-2">
              {report.sud_jarayoni.split('. ').map((stage, sIdx) => (
                <div key={sIdx} className="flex space-x-3 items-start relative group">
                  <div className="h-6 w-6 rounded-full bg-blue-950/30 text-blue-400 border border-blue-900/40 flex items-center justify-center font-bold font-mono text-[10px] z-10 shrink-0">
                    {sIdx + 1}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-0.5 stage_desc_item">
                    {stage}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 💎 Tile 7: HIGHLIGHTED ALTERNATIVE DISPUTE RESOLUTION RESOLUTION */}
          <Card
            id="report_bento_alternative"
            className="md:col-span-3 border-2 border-[#c9a84c]/40 bg-gradient-to-r from-[#16213e]/90 to-[#101726]/90 p-8 space-y-6 relative overflow-hidden bento_alt"
          >
            <div className="absolute -top-12 -right-12 h-44 w-44 bg-gradient-to-bl from-[#c9a84c]/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#c9a84c] text-[#1a1a2e] rounded-xl p-2 font-bold shadow-md shadow-[#c9a84c]/10">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold leading-none">{language === 'uz' ? 'MIZAN SMART TAVSIYASI' : 'РЕКОМЕНДАЦИЯ MIZAN'}</span>
                  <h3 className="font-serif text-lg font-extrabold text-white mt-1 col_white">{t('rep_alt_section')}: {report.alternativ_yechim.tavsiya}</h3>
                </div>
              </div>
              <div className="bg-green-950/30 border border-green-500/50 rounded-lg px-3 py-1 text-green-400 text-xs font-bold font-serif shadow-sm shadow-green-500/5 shrink-0 bg_green_badge">
                {language === 'uz' ? 'Tejalgan mablag\':' : 'Сэкономлено:'} {report.alternativ_yechim.taxminiy_tejash}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text_row">
              
              {/* Context analysis */}
              <div className="md:col-span-1 space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed border-r border-transparent md:border-gray-800 pr-0 md:pr-6 border_box">
                <span className="text-[#c9a84c] font-bold">{t('rep_alt_why')}?</span>
                <p>{report.alternativ_yechim.sabab}</p>
              </div>

              {/* Step checklist */}
              <div className="md:col-span-2 space-y-3.5">
                <span className="text-gray-400 font-bold text-xs">{t('rep_alt_steps')}:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.alternativ_yechim.qadamlar.map((action, actionIdx) => (
                    <div key={actionIdx} className="bg-[#101726]/40 border border-gray-800/80 rounded-xl p-3 flex items-start space-x-2.5 hover:border-gray-700 transition-colors step_box">
                      <ArrowRight className="h-4 w-4 text-[#c9a84c] shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-300 leading-relaxed">
                        <span className="text-[10px] uppercase font-mono text-[#c9a84c] block mb-0.5">{language === 'uz' ? `QADAM ${actionIdx + 1}` : `ШАГ ${actionIdx + 1}`}</span>
                        <span>{action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Card>

          {/* 💎 Tile 8: MAX TARIFF EXCLUSIVE MEDIATOR REVIEW REPORT */}
          {report.mediator_xulosasi ? (
            <Card
              id="report_bento_mediator"
              className="md:col-span-3 border border-[#c9a84c]/60 bg-gradient-to-r from-amber-950/10 via-[#0f1426] to-[#0f1426] p-8 space-y-6 relative overflow-hidden bento_mediator"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-[#c9a84c]/15 to-transparent pointer-events-none rounded-bl-full"></div>
              
              <div className="flex items-center space-x-3.5 border-b border-gray-800/80 pb-4">
                <div className="bg-[#c9a84c] text-black rounded-xl p-2.5 font-bold shadow-md shadow-[#c9a84c]/20">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#c9a84c] font-bold leading-none">{language === 'uz' ? 'EKSKLUZIV TARIFA KAFOLATI' : 'ЭКСКЛЮЗИВНЫЙ ТАРИФ'}</span>
                    <span className="text-[8px] bg-[#c9a84c]/25 border border-[#c9a84c]/50 text-[#c9a84c] font-mono font-bold px-1.5 py-0.2 rounded-full tracking-wider ml-1">MAX EXCLUSIVE</span>
                  </div>
                  <h3 className="font-serif text-lg font-extrabold text-white mt-1.5 col_white">{t('rep_mediator_review')}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-serif italic text-justify bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 text_quote">
                  "{report.mediator_xulosasi}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 sub_cols">
                  <div className="bg-[#121828]/60 p-4 rounded-xl border border-gray-800/60 text-left space-y-1 block1">
                    <span className="text-[10px] text-[#c9a84c] font-bold block uppercase tracking-wider">
                      {language === 'uz' ? "1. Sudgacha Bo'lgan Da'vo Daftari" : "1. Досудебная претензия"}
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {language === 'uz' ? "Sudgacha bo'lgan rasmiy e'tiroz va uning argumentlari mediatorlar tomonidan 100% rasmiylashtirildi." : "Официальные претензии и доводы досудебного претензионного урегулирования заверены медиатором."}
                    </p>
                  </div>
                  <div className="bg-[#121828]/60 p-4 rounded-xl border border-gray-800/60 text-left space-y-1 block2">
                    <span className="text-[10px] text-[#c9a84c] font-bold block uppercase tracking-wider">
                      {language === 'uz' ? "2. Sulh Kelishuvi Muzokaralari" : "2. Переговоры по соглашению"}
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {language === 'uz' ? "Tomonlarning qonuniy manfaatlarini muvozanatlovchi tayyor muzokara varaqasi taqdim etildi." : "Предоставлено готовое соглашение о примирении сторон, балансирующее их законные интересы."}
                    </p>
                  </div>
                  <div className="bg-[#121828]/60 p-4 rounded-xl border border-[#c9a84c]/20 text-left space-y-1 block3">
                    <span className="text-[10px] text-[#c9a84c] font-bold block uppercase tracking-wider">
                      {language === 'uz' ? "3. Mutaxassis Tasdig'i" : "3. Подтверждение эксперта"}
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {language === 'uz' ? "Tizimdagi va qonundagi barcha tahlillar insoniy professionallar tomonidan to'liq verifikatsiya qilindi." : "Все автоматические формулировки сверены юридическими экспертами и приведены к полной силе."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            user?.tariff === 'MAX' && (
              <Card
                id="report_bento_mediator_waiting"
                className="md:col-span-3 border border-dashed border-[#c9a84c]/50 bg-[#c9a84c]/5 p-8 text-center space-y-4 custom_wait"
              >
                <div className="mx-auto bg-[#c9a84c]/10 h-10 w-10 flex items-center justify-center rounded-xl border border-[#c9a84c]/30 text-[#c9a84c]">
                  <Scale className="h-5 w-5 animate-pulse" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-serif font-bold text-lg col_white">
                  {language === 'uz' ? 'Professional Mediatorlar Ko\'rib Chiqishmoqda...' : 'Рассматривается профессиональным медиатором...'}
                </h3>
                <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed desc_wait">
                  {language === 'uz' 
                    ? "Siz **MAX** ta'rifidasiz. Sun'iy intellekt xulosasi va siz yuklagan hujjatlar, cheklar, vajlar ayni damda professional qonuniy mediatorlarimiz tomonidan to'laqonli o'rganilmoqda va verifikatsiya qilinmoqda. Biz sizga professional kengash xulosasini shu yerda tez fursatda taqdim etamiz. Sahifani yangilab turing!"
                    : "Вы подключили тариф **MAX**. Автоматический ИИ-анализ и приложенные вами документы в данный момент детально изучаются и верифицируются нашими профессиональными медиаторами. Мы предоставим официальное заключение экспертов в этом разделе в кратчайшие сроки. Пожалуйста, обновите страницу позже."}
                </p>
              </Card>
            )
          )}

        </div>

        {/* 📋 LEGAL WARNING NOTE - HUMBLE FOOTER ACCENTS */}
        <div className="border-t border-gray-800 pt-6 text-center text-[10px] text-gray-500 max-w-2xl mx-auto space-y-2 font-serif leading-relaxed warning_footer">
          <p className="uppercase text-amber-500/60 font-semibold tracking-wider">⚠️ {language === 'uz' ? 'Rasmiy Ogohlantirish' : 'Предупреждение платформы'}</p>
          <p>
            {language === 'uz' 
              ? "Mizan AI tahlil hisoboti sun'iy intellekt hamda muayyan RAG qonuniy ma'lumotlar bazasi asosida tuzilgan bo'lib, uning kutilmalari sud amaliyotidagi o'zgarishlar, guvoh ko'rsatmalari va sud'ya qaroriga muvofiq farq qilishi mumkin. Mizan hech qanday qonuniy majburiyat yoki suddagi natija bo'yicha yakuniy kafolat bermaydi. Ushbu hujjat sudgacha bo'lgan yordamchi maslahat hujjati hisoblanadi."
              : "Аналитический отчет Mizan AI составлен на стыке систем искусственного интеллекта и векторных технологий поиска юридических материалов (RAG). Степень и исход дела могут варьироваться судом в зависимости от дополнительных фактов, свидетельских показаний и дискреционных полномочий судей. Сервис Mizan не гарантирует конечные результаты судебных процессов и не несет за них правовой ответственности. Отчет служит исключительно вспомогательным рекомендательным ресурсом досудебного порядка."}
          </p>
        </div>

      </div>
    </div>
  );
};
