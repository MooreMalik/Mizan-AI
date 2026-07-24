import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Info, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { color } from 'motion';

interface PricingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user, updateUserTariff } = useAuth();
  const { t, language } = useAppContext();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const plans = [
    {
      id: 'PLUS',
      name: language === 'uz' ? 'Plus' : 'Plus',
      price: language === 'uz' ? '125,000 UZS' : '125 000 UZS',
      priceUsd: '$10',
      description: language === 'uz'
        ? 'Bir martalik AI huquqiy tahlil — suddan oldingi asosiy maslahat'
        : 'Единоразовый AI-анализ — базовая консультация перед судом',
      features: language === 'uz' ? [
        '7 kun tekin foydalanish imkoniyati',
        'AI bilan to\'liq huquqiy suhbat (bosqichma-bosqich)',
        'Hujjat yuklash va tahlil (PDF/JPG/PNG)',
        'RAG: O\'zbekiston qonunchiligi asosida tahlil',
        'Yutish ehtimoli (%) hisoblash',
        'Taxminiy sud muddati va xarajat',
        'Alternativ huquqiy yechim taklifi',
      ] : [
        '7 дня бесплатного использования',
        'Полный AI-диалог по делу (пошагово)',
        'Загрузка и анализ документов (PDF/JPG/PNG)',
        'RAG: Анализ на основе законодательства Узбекистана',
        'Расчёт вероятности победы (%)',
        'Примерные сроки и расходы на суд',
        'Предложение альтернативного правового решения',
      ],
      notIncluded: language === 'uz' ? [
        'Arxivda saqlash',
        'PDF hisobot eksport',
        'Real mediator ko\'rib chiqishi',
      ] : [
        'Хранение в архиве',
        'Экспорт PDF-отчёта',
        'Рассмотрение дела реальным медиатором',
      ],
      cta: language === 'uz' ? 'Tahlil Boshlash' : 'Начать анализ',
      popular: false,
    },
    {
      id: 'PRO',
      name: language === 'uz' ? 'Pro' : 'Pro',
      price: language === 'uz' ? '250,000 UZS' : '250 000 UZS',
      priceUsd: '$20',
      description: language === 'uz'
        ? 'Kengaytirilgan tahlil — arxiv va PDF hisobot bilan'
        : 'Расширенный анализ — с архивом и PDF-отчётом',
      features: language === 'uz' ? [
        '3 kun tekin foydalanish imkoniyati',
        'Plus tarifidagi barcha imkoniyatlar',
        'Cheksiz hujjat yuklash va tahlili',
        'RAG: To\'liq qonunchilik bazasi',
        'PDF hisobot yuklab olish',
        'Arxivda doimiy saqlash',
        'Kengaytirilgan tahlil va qo\'shimcha savollar',
      ] : [
        '3 дня бесплатного использования',
        'Все возможности тарифа Plus',
        'Безлимитная загрузка и анализ документов',
        'RAG: Полная база законодательства',
        'Скачивание PDF-отчёта',
        'Постоянное хранение в архиве',
        'Расширенный анализ и дополнительные вопросы',
      ],
      notIncluded: language === 'uz' ? [
        'Real mediator ko\'rib chiqishi',
      ] : [
        'Рассмотрение дела реальным медиатором',
      ],
      cta: language === 'uz' ? 'Pro Tahlil' : 'Pro-анализ',
      popular: true,
    },
    {
      id: 'MAX',
      name: language === 'uz' ? 'Max' : 'Max',
      price: language === 'uz' ? '875,000 UZS' : '875 000 UZS',
      priceUsd: '$70',
      description: language === 'uz'
        ? 'AI tahlil + real mediator ko\'rib chiqishi — eng ishonchli yechim'
        : 'AI-анализ + проверка реальным медиатором — максимальная надёжность',
      features: language === 'uz' ? [
        'Pro tarifidagi barcha imkoniyatlar',
        'Real sertifikatlangan mediator ko\'rib chiqishi',
        'Mediator bilan shaxsiy maslahat sessiyasi',
        'Muzokaralar uchun kelishuv varaqasi',
        'Ustuvor xizmat va tez javob',
        '100% huquqiy ishonchlilik',
      ] : [
        'Все возможности тарифа Pro',
        'Проверка сертифицированным медиатором',
        'Личная консультационная сессия с медиатором',
        'Формирование соглашений для переговоров',
        'Приоритетное обслуживание и быстрый ответ',
        '100% правовая надёжность',
      ],
      notIncluded: [],
      cta: language === 'uz' ? 'Mutaxassisga Ulash' : 'Связаться со специалистом',
      popular: false,
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      onNavigate('login', { mode: 'register', tariff: planId });
      return;
    }

    updateUserTariff(planId as any);
    const successMsg = language === 'uz'
      ? `"${planId}" tarifi muvaffaqiyatli tanlandi! Tahlilni boshlashingiz mumkin.`
      : `Тариф "${planId}" успешно выбран! Можно начинать анализ.`;
    setSuccessMessage(successMsg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div id="pricing_page" className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
            {language === 'uz' ? 'Narxlar' : 'Тарифы'}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            {language === 'uz' ? 'Huquqiy aniqlik — bir bosishda' : 'Правовая ясность — в один клик'}
          </h1>
          {/* Advokat comparison badge */}
          <div className="inline-flex items-center gap-2 bg-green-950/30 border border-green-500/30 rounded-full px-4 py-1.5 text-xs text-green-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            {language === 'uz'
              ? 'Maksimal xizmatlardan Minimum narxlarda foydalaning'
              : 'Максимум услуг по минимальным ценам'}
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="max-w-lg mx-auto bg-green-950/30 border border-green-500/50 p-4 rounded-xl text-green-400 text-center text-sm font-semibold flex items-center justify-center space-x-2 animate-fade-in">
            <ShieldCheck className="h-5 w-5 animate-pulse" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-8">
          {plans.map((plan) => {
            const isUserCurrent = user?.tariff === plan.id;

            return (
              <Card
                id={`pricing_card_${plan.id.toLowerCase()}`}
                key={plan.id}
                accented={plan.popular || isUserCurrent}
                hoverable
                className="flex flex-col justify-between h-full relative"
              >
                {plan.popular && (
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-[#c9a84c] border border-[#c9a84c]/50 bg-[#c9a84c]/10 px-2 py-0.5 rounded-full tracking-widest font-mono">
                    {language === 'uz' ? 'Ommabop' : 'Популярный'}
                  </span>
                )}

                {isUserCurrent && (
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-green-400 border border-green-500/50 bg-green-950/20 px-2 py-0.5 rounded-full tracking-widest font-mono">
                    {language === 'uz' ? 'Faol' : 'Активный'}
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 min-h-[40px]">{plan.description}</p>
                  </div>

                  <div className="border-y border-gray-800/80 py-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">{plan.price}</p>
                      <span className="text-sm font-semibold text-[#c9a84c]">{plan.priceUsd}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">
                      {language === 'uz' ? '/ bir tahlil uchun' : '/ за один анализ'}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 text-xs text-gray-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-[#c9a84c] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}

                    {plan.notIncluded.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 opacity-35 text-gray-400">
                        <span className="h-4 w-4 text-gray-500 shrink-0 select-none text-center font-bold">×</span>
                        <span className="line-through">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Button
                    id={`pricing_btn_${plan.id.toLowerCase()}`}
                    onClick={() => handleSelectPlan(plan.id)}
                    variant={isUserCurrent ? 'accent' : plan.popular ? 'primary' : 'secondary'}
                    fullWidth
                    disabled={isUserCurrent}
                  >
                    {isUserCurrent ? (language === 'uz' ? 'Faol tarif' : 'Активный тариф') : plan.cta}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQ / info block */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#16213e] border border-white/5 p-6 flex items-start space-x-4 shadow-xl">
          <Info className="h-5 w-5 text-[#c9a84c] shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
            <h4 className="font-serif text-sm font-semibold text-white">
              {language === 'uz' ? 'Qanday ishlaydi?' : 'Как это работает?'}
            </h4>
            <p>
              {language === 'uz'
                ? 'Tarif tanlaysiz → To\'lov amalga oshirasiz → AI bilan suhbat boshlanadi. Mizan sizning holatin bosqichma-bosqich o\'rganib, barcha hujjatlaringizni tahlil qiladi va to\'liq hisobot beradi. Barcha ma\'lumotlar faqat server ichida saqlanadi — hech qanday ma\'lumot tashqariga chiqmaydi.'
                : 'Выбираете тариф → Оплачиваете → Начинается диалог с AI. Mizan изучает вашу ситуацию пошагово, анализирует документы и выдаёт полный отчёт. Все данные хранятся только на сервере — никакая информация не покидает систему.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};