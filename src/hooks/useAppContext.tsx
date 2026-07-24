import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uz' | 'ru';
type Theme = 'dark' | 'light';

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const dictionary: Record<Language, Record<string, string>> = {
  uz: {
    'nav_info': "Ma'lumot",
    'nav_pricing': "Tariflar",
    'nav_consultation': "AI Konsultatsiya",
    'nav_mediator_panel': "Mediator Panel",
    'nav_logout': "Chiqish",
    'nav_login': "Kirish",
    'nav_register': "Ro'yxatdan o'tish",
    'nav_tagline': "AI Sud Maslahatchisi",
    'nav_tariff_suffix': "TARIFA",

    'hero_badge': "XAVFSIZ VA MAXFIY • LOKAL SERVERDAGI SUN'IY INTELLEKT",
    'hero_title_1': "Sudga borishdan oldin",
    'hero_title_2': "Mizan AI bilan tahlil qiling",
    'hero_desc': "Huquqiy nizo yoki muammoli holatingizni kiriting. Mizan AI O'zbekiston qonunchiligini tahlil qilib, suddagi kutilmalar, xarajatlar va yutish ehtimolini hisoblab beradi.",
    'hero_start_cta': "Tahlilni Boshlash (Bepul)",
    'hero_pricing_cta': "Tariflar bilan Tanishish",
    'stat_privacy': "Sessiyalar maxfiyligi",
    'stat_saving': "Mediatsiya bilan tejash",
    'stat_database': "Haqiqiy qonunlar bazasi",
    'stat_archive': "Avtomatik arxiv tozalash",
    'steps_badge': "Oddiy va Samarali",
    'steps_title': "Hisobot Qanday Shakllantiriladi?",
    'steps_desc': "Siz muloqot qilasiz, biz esa O'zbekiston qonunchiligining murakkab mexanizmlari bo'yicha toza matematik va huquqiy tahlilni chiqaramiz.",
    'step1_title': "Holatni bayon qiling",
    'step1_desc': "Bizning maslahatchi bilan suhbatda ishingizni, nizo tafsilotlarini va yetkazilgan zarar miqdorini oddiy tilda bayon qilasiz.",
    'step2_title': "Hujjatlarni yuklang",
    'step2_desc': "Shartnoma, tushum cheklari, yoki rasmiy yozishmalarni (pdf, png, jpg) xavfsiz biriktiring. Tizim ularni server ichida tahlil qiladi.",
    'step3_title': "RAG Qonun qidirish",
    'step3_desc': "Mizan o'zining vektor bazasidan ishingizga mos Fuqarolik va Da'vo Kodekslarining real moddalarini filtrlab promptga biriktiradi.",
    'step4_title': "Mukammal hisobot",
    'step4_desc': "Yutish ehtimoli grafikasi, davlat boji va advokat xarajatlari hisob-kitobi, sud muddatlari va tinch alternativ yechimlar tahlili.",
    'why_badge': "Nega Mizan?",
    'why_title': "Adolatli qaror qabul qilishda professional tayyorgarlik",
    'why_desc': "Sizga advokat yoki maslahatchi xizmatlari kerak bo'lishidan oldin, Mizan tizimi kiberxavfsiz va aniq huquqiy tahlildan foydalanib xavflaringizni minimal qiladi.",
    'why1_title': "Sanoat darajasidagi Kiberxavfsizlik",
    'why1_desc': "Barcha fayllar faqat serverda shifrlangan qoladi, uchinchi tarafga chiqmaydi.",
    'why2_title': "Aniq RAG (Qonun hujjatlar tahlili)",
    'why2_desc': "O'zbekiston Fuqarolik kodeksi va boshqa kodeks moddalari bilan bog'liq bo'lgan rasmiy qidiruv.",
    'why3_title': "Vaqt va mablag' tahlili",
    'why3_desc': "Davlat boji miqdori stavkalari hamda sud jarayonining bosqichma-bosqich muddati.",
    'calc_title': "Mizan Sud Kalkulyatori",
    'calc_sub': "BHM 340,000 UZS bo'yicha",
    'calc_status': "Tizim Online",
    'calc_type': "Ish turi:",
    'calc_type_val': "Shartnoma buzilishi, Qarz",
    'calc_duty': "Davlat boji:",
    'calc_duty_val': "Da'vo summasining 4%i",
    'calc_win': "Yutish imkoniyati:",
    'calc_win_val': "75% - 85% atrofida",
    'calc_alt': "Alternativ yechim:",
    'calc_alt_val': "Mediatsiya kelishuvi (-50% boj)",
    'calc_cta': "Hoziroq tekshiring",
    'partner_title': "Siz mediatormisiz yoki advokatmisiz?",
    'partner_desc': "Mizan orqali har kuni yuzlab mijozlar sudgacha bo'lgan kelishuv bosqichlarini qidirmoqdalar. Professional mediator yoki yuridik byuro sifatida biz bilan hamkorlik qiling va to'g'ridan-to'g'ri ishlarni qabul qiling.",
    'partner_cta': "Hamkorlik Tariflari (MAX)",

    'login_welcome': "Assalomu Alaykum",
    'login_subtitle': "Platformaga xavfsiz kirish va tahlil hisobotlari",
    'reg_welcome': "Ro'yxatdan o'tish",
    'reg_subtitle': "Sassiyalar va to'liq sud-huquqiy hisobotlar xizmati",
    'label_fullname': "To'liq ism-sharifingiz",
    'label_email': "Email manzilingiz",
    'label_password': "Parolingiz",
    'label_tariff': "Tarifni tanlang",
    'label_role': "Sizning rolingiz",
    'role_client': "Mijoz (Da'vogar / Sud ishtirokchisi)",
    'role_mediator': "Professional Mediator (Yuristik maslahatchi)",
    'btn_signin': "Kirish",
    'btn_signup': "Ro'yxatdan o'tish",
    'no_acc': "Profilingiz yo'qmi?",
    'have_acc': "Profilingiz bormi?",
    'go_reg': "Yangi profil ochish",
    'go_login': "Tizimga kirish",

    'price_badge': "TADRIJIY ADOLAT",
    'price_title': "Sizga mos tarif rejalari",
    'price_desc': "Insoniy daho va sun'iy intellekt uyg'unligida nizorlarni tezkor hamda arzon yechish paketlari.",
    'price_free_name': "Bepul maslahat",
    'price_free_desc': "Boshlang'ich holatni va nizo tahlilini tezkor shakllantirish.",
    'price_free_lim': "1 ta muloqot sessiyasi",
    'price_plus_name': "Mizan PLUS",
    'price_plus_desc': "Davlat boji hisoblagichi, real vaqt tahlili va biriktirilgan hujjatlarni o'qish.",
    'price_plus_lim': "5 ta to'liq sessiya va tahlil",
    'price_pro_name': "Mizan PRO",
    'price_pro_desc': "Advokatlik va Sudgacha vaqt, xarajatlar diagrammasi hamda muqobil solishtirish.",
    'price_pro_lim': "Cheksiz sessiyalar + PDF hisobot generatsiyasi",
    'price_max_name': "Mediator / Advokat",
    'price_max_desc': "Mediatsiya ishlari bazasi, hamkorlik mijozi tahlillari va professional panel.",
    'price_max_lim': "Mediatorlar reyestri + Mijozlarni qabul qilish",
    'price_popular': "Eng ko'p tanlangan",
    'price_get_started': "Boshlash",
    'price_active': "Faol reja",
    'price_upgrade': "Tarifni almashtirish",

    'chat_title': "Mizan AI Yuridik Konsultatsiya",
    'chat_badge': "O'zbek qonunchiligi asosida mustahkam tahlil",
    'chat_sidebar': "Muloqotlar tarixi",
    'chat_new_btn': "Yangi muloqot ochish",
    'chat_step1_badge': "1-BOSQICH",
    'chat_step1_txt': "Holatni aniqlash",
    'chat_step2_badge': "2-BOSQICH",
    'chat_step2_txt': "Vaj va talablar",
    'chat_step3_badge': "3-BOSQICH",
    'chat_step3_txt': "Hujjat/Dalillar",
    'chat_step4_badge': "4-BOSQICH",
    'chat_step4_txt': "Sud tahlili hisoboti",
    'chat_placeholder': "Nizo holati, shartnoma shartlari yoki da'vo predmeti haqida batafsil yozing...",
    'chat_btn_send': "Yuborish",
    'chat_btn_analyze': "Sud tahlili hisobotini shakllantirish",
    'chat_prompt_placeholder': "Yozing...",
    'chat_upload_tooltip': "Hujjat yuklash (Daftar, shartnoma, chek va h.k.)",
    'chat_empty_state': "Sudgacha bo'lgan tahlilni boshlash uchun o'zingizni qiynayotgan masalani yoki nizoni yozing. Mizan RAG yordamida qonunlarni topadi va sud imkoniyatini ko'rsatadi.",

    'rep_main_title': "Суд Таҳлили Ҳисоботи",
    'rep_sub': "Mizan AI sud imkoniyatlarining yurisdiksiya tahlili",
    'rep_theme': "SUD MAVZUSI",
    'rep_desc': "HOLAT HUQUQIY TAVSIFI",
    'rep_articles': "ISHGA ALOQADOR QONUN HUJJATLARI VA MODDALAR (RAG)",
    'rep_stages': "SUD PROCESSINING BOSQICHLARI",
    'rep_time_req': "SUD MUDDATI KUTILMASI",
    'rep_cost_req': "TAXMINIY SUD XARAJATLARI",
    'rep_court_fee': "Davlat boji",
    'rep_advocate_fee': "taxminiy advokatlik",
    'rep_win_rate': "SUDDA YUTIB CHIQISH IMKONIYATI",
    'rep_reasons_pro': "YELDAMLIK VA G'ALABA SABABLARI (DALILLAR)",
    'rep_reasons_con': "KUTILAYOTGAN XATARLAR VA ZAIF TOMONLAR",
    'rep_alt_section': "SUDGA ENG OPTIMAL MUQOBIL HUQUQIY YECHIM",
    'rep_alt_recomm': "Tavsiya etilgan maqbul yechim",
    'rep_alt_why': "Nega aynan ushbu kelishuv yutug'i yuqoriroq?",
    'rep_alt_steps': "Alternativ yechimning amaliy qadamlari",
    'rep_alt_saves': "Siz tejaydigan vaqt va xarajat",
    'rep_btn_print': "Hisobotni chop etish (PDF)",
    'rep_btn_back': "Muloqotga qaytish",
    'rep_mediator_review': "MEDIATORNING PROFESSIONAL XULOSASI",
    'rep_mediator_write': "O'z mediatorlik xulosangiz yoki sulh tavsiyalaringizni yozib qoldiring:",
    'rep_mediator_save': "Xulosani yozib saqlash",

    'med_title': "Mediator va Yuridik Hamkorlar Paneli",
    'med_sub': "Mijozlar tomonidan jo'natilgan nizolarni ko'rish va kelishuv bitimini kiritish",
    'med_col_user': "Mijoz / Telefon",
    'med_col_theme': "Nizo mavzusi",
    'med_col_win': "Yutish %",
    'med_col_date': "Yuborilgan sana",
    'med_col_action': "Ko'rish / Xulosa",
    'med_not_reviewed': "Xulosa yozilmagan",
    'med_reviewed': "Ko'rib chiqilgan",
    'med_empty': "Hozircha birorta ham mijoz sud hisoboti jo'natmagan."
  },
  ru: {
    'nav_info': "Информация",
    'nav_pricing': "Тарифы",
    'nav_consultation': "AI Консультация",
    'nav_mediator_panel': "Панель медиатора",
    'nav_logout': "Выйти",
    'nav_login': "Войти",
    'nav_register': "Регистрация",
    'nav_tagline': "AI Судебный Консультант",
    'nav_tariff_suffix': "ТАРИФ",

    'hero_badge': "БЕЗОПАСНЫЙ И КОНФИДЕНЦИАЛЬНЫЙ • ИИ НА ЛОКАЛЬНОМ СЕРВЕРЕ",
    'hero_title_1': "Перед тем как идти в суд",
    'hero_title_2': "проанализируйте с Mizan AI",
    'hero_desc': "Введите ваш спор или правовую проблему. Mizan AI проанализирует законодательство Узбекистана, рассчитает шансы, судебные издержки и вероятность победы.",
    'hero_start_cta': "Начать анализ (Бесплатно)",
    'hero_pricing_cta': "Ознакомиться с тарифами",
    'stat_privacy': "Конфиденциальность сессий",
    'stat_saving': "Экономия на медиации",
    'stat_database': "База реальных законов",
    'stat_archive': "Автоочистка архива за 30 дней",
    'steps_badge': "Просто и эффективно",
    'steps_title': "Как формируется отчет?",
    'steps_desc': "Вы общаетесь, а мы извлекаем чистый математический и юридический анализ сложных законов Узбекистана.",
    'step1_title': "Опишите вашу ситуацию",
    'step1_desc': "В диалоге с нашим консультантом опишите ваше дело, детали спора и сумму ущерба простым языком.",
    'step2_title': "Загрузите документы",
    'step2_desc': "Прикрепите договор, чеки об оплате или переписку (pdf, png, jpg). Система безопасно проанализирует их.",
    'step3_title': "RAG поиск законов",
    'step3_desc': "Mizan находит и фильтрует статьи Гражданского и иных кодексов из своей векторной базы для точного анализа.",
    'step4_title': "Подробный отчет",
    'step4_desc': "График шансов на победу, расчет госпошлин и расходов на адвоката, сроки и альтернативы мирного урегулирования.",
    'why_badge': "Почему Mizan?",
    'why_title': "Профессиональная подготовка к справедливому решению",
    'why_desc': "Прежде чем вам понадобятся услуги адвоката, Mizan снизит ваши риски с помощью безопасного и точного правового анализа.",
    'why1_title': "Кибербезопасность промышленного уровня",
    'why1_desc': "Все файлы остаются на сервере в зашифрованном виде, без доступа третьих лиц.",
    'why2_title': "Точный RAG (Анализ законов)",
    'why2_desc': "Официальный поиск, сопоставленный со статьями Гражданского кодекса РУз и других кодексов.",
    'why3_title': "Анализ времени и затрат",
    'why3_desc': "Ставки госпошлины и пошаговые сроки судебного процесса.",
    'calc_title': "Судебный Калькулятор Mizan",
    'calc_sub': "На основе БРВ 340,000 UZS",
    'calc_status': "Система Онлайн",
    'calc_type': "Тип дела:",
    'calc_type_val': "Нарушение договора, Долг",
    'calc_duty': "Госпошлина:",
    'calc_duty_val': "4% от суммы иска",
    'calc_win': "Шанс на победу:",
    'calc_win_val': "около 75% - 85%",
    'calc_alt': "Альтернатива:",
    'calc_alt_val': "Медиативное соглашение (-50% пошлин)",
    'calc_cta': "Проверить сейчас",
    'partner_title': "Вы медиатор или адвокат?",
    'partner_desc': "Каждый день через Mizan сотни клиентов ищут пути досудебного соглашения. Сотрудничайте с нами в качестве профессионального медиатора или юрбюро.",
    'partner_cta': "Тарифы сотрудничества (MAX)",

    'login_welcome': "Добро пожаловать",
    'login_subtitle': "Безопасный доступ к платформе и отчетам анализа",
    'reg_welcome': "Регистрация",
    'reg_subtitle': "Услуга сессий и полных судебных отчетов",
    'label_fullname': "Ваше полное имя",
    'label_email': "Ваш Email",
    'label_password': "Ваш пароль",
    'label_tariff': "Выберите тариф",
    'label_role': "Ваша роль",
    'role_client': "Клиент (Истец / Участник спора)",
    'role_mediator': "Профессиональный Медиатор (Юрисконсульт)",
    'btn_signin': "Войти",
    'btn_signup': "Зарегистрироваться",
    'no_acc': "Нет аккаунта?",
    'have_acc': "Есть аккаунт?",
    'go_reg': "Создать новый аккаунт",
    'go_login': "Войти в систему",

    'price_badge': "ПОЭТАПНАЯ СПРАВЕДЛИВОСТЬ",
    'price_title': "Подходящие тарифные планы",
    'price_desc': "Пакеты быстрого и доступного разрешения споров в гармонии ума и искусственного интеллекта.",
    'price_free_name': "Бесплатная консультация",
    'price_free_desc': "Быстрое формирование первоначальной ситуации и анализа спора.",
    'price_free_lim': "1 сессия общения",
    'price_plus_name': "Mizan PLUS",
    'price_plus_desc': "Калькулятор госпошлины, анализ в реальном времени и чтение приложенных документов.",
    'price_plus_lim': "5 полных сессий и анализов",
    'price_pro_name': "Mizan PRO",
    'price_pro_desc': "Адвокатские и досудебные диаграммы времени, затрат и альтернативного сравнения.",
    'price_pro_lim': "Безлимитные сессии + Генерация PDF отчетов",
    'price_max_name': "Медиатор / Адвокат",
    'price_max_desc': "База медиативных дел, аналитика совместных клиентов и профессиональная панель.",
    'price_max_lim': "Реестр медиаторов + Прием клиентов",
    'price_popular': "Наиболее популярный",
    'price_get_started': "Начать",
    'price_active': "Активный тариф",
    'price_upgrade': "Сменить тариф",

    'chat_title': "Mizan AI Юридическая Консультация",
    'chat_badge': "Качественный анализ на основе законодательства Узбекистана",
    'chat_sidebar': "История консультаций",
    'chat_new_btn': "Открыть новый диалог",
    'chat_step1_badge': "ЭТАП 1",
    'chat_step1_txt': " Определение ситуации",
    'chat_step2_badge': "ЭТАП 2",
    'chat_step2_txt': "Доводы и требования",
    'chat_step3_badge': "ЭТАП 3",
    'chat_step3_txt': "Документы/Доказательства",
    'chat_step4_badge': "ЭТАП 4",
    'chat_step4_txt': "Судебный аналитический отчет",
    'chat_placeholder': "Опишите подробно спорную ситуацию, условия договора или предмет иска...",
    'chat_btn_send': "Отправить",
    'chat_btn_analyze': "Сформировать отчет судебного анализа",
    'chat_prompt_placeholder': "Напишите...",
    'chat_upload_tooltip': "Загрузить документ (договор, чек, квитанция и т.д.)",
    'chat_empty_state': "Чтобы начать досудебный анализ, опишите волнующий вас вопрос или спор. Mizan найдет законы с помощью RAG и покажет ваши судебные шансы.",

    'rep_main_title': "Отчет Судебного Анализа",
    'rep_sub': "Юрисдикционный анализ судебных перспектив от Mizan AI",
    'rep_theme': "ТЕМА СУДЕБНОГО ДЕЛА",
    'rep_desc': "ЮРИДИЧЕСКОЕ ОПИСАНИЕ СИТУАЦИИ",
    'rep_articles': "ЗАКОНОДАТЕЛЬСТВО И СТАТЬИ, ОТНОСЯЩИЕСЯ К ДЕЛУ (RAG)",
    'rep_stages': "ЭТАПЫ СУДЕБНОГО ПРОЦЕССА",
    'rep_time_req': "ОЖИДАЕМЫЕ СРОКИ СУДА",
    'rep_cost_req': "ОРИЕНТИРОВОЧНЫЕ СУДЕБНЫЕ РАСХОДЫ",
    'rep_court_fee': "Госпошлина",
    'rep_advocate_fee': "ориентировочно адвокатские",
    'rep_win_rate': "ВЕРОЯТНОСТЬ ПОБЕДЫ В СУДЕ",
    'rep_reasons_pro': "АРГУМЕНТЫ И ПРИЧИНЫ ДЛЯ ПОБЕДЫ (ДОКАЗАТЕЛЬСТВА)",
    'rep_reasons_con': "ОЖИДАЕМЫЕ РИСКИ И СЛАБЫЕ СТОРОНЫ",
    'rep_alt_section': "НАИБОЛЕЕ ОПТИМАЛЬНОЕ АЛЬТЕРНАТИВНОЕ ЮРИДИЧЕСКОЕ РЕШЕНИЕ",
    'rep_alt_recomm': "Рекомендуемое альтернативное решение",
    'rep_alt_why': "Почему шансы этого соглашения выше?",
    'rep_alt_steps': "Практические шаги альтернативного решения",
    'rep_alt_saves': "Сэкономленное вами время и расходы",
    'rep_btn_print': "Печать отчета (PDF)",
    'rep_btn_back': "Вернуться к диалогу",
    'rep_mediator_review': "ПРОФЕССИОНАЛЬНОЕ ЗАКЛЮЧЕНИЕ МЕДИАТОРА",
    'rep_mediator_write': "Оставьте свое заключение медиатора или рекомендации по примирению:",
    'rep_mediator_save': "Сохранить заключение",

    'med_title': "Панель Медиаторов и Юридических Партнеров",
    'med_sub': "Просмотр споров, отправленных клиентами, и ввод мировых соглашений",
    'med_col_user': "Клиент / Телефон",
    'med_col_theme': "Тема спора",
    'med_col_win': "Победа %",
    'med_col_date': "Дата отправки",
    'med_col_action': "Просмотр / Заключение",
    'med_not_reviewed': "Без заключения",
    'med_reviewed': "Рассмотрено",
    'med_empty': "На данный момент ни один клиент не отправил судебный отчет."
  }
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mizan_lang');
    return (saved === 'uz' || saved === 'ru') ? saved : 'uz';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('mizan_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('mizan_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mizan_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const t = (key: string): string => {
    const translation = dictionary[language][key];
    if (translation !== undefined) {
      return translation;
    }
    return dictionary['uz'][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
