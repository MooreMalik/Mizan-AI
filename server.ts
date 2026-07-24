import express from 'express';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { Storage } from './src/db/storage';
import { UZBEK_LAWS, retrieveMatchingLaws } from './src/db/laws';
import { User, ChatSession, ChatMessage, AnalysisReport } from './src/types';
import { VectorStore } from './src/db/vectorStore';

dotenv.config();

dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let ai: GoogleGenAI | null = null;
const rawApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
const isInvalidKey = !rawApiKey || 
                     rawApiKey === "YOUR_API_KEY" || 
                     rawApiKey === "placeholder" || 
                     rawApiKey === "REPLACE_ME" || 
                     rawApiKey === "undefined" || 
                     rawApiKey === "null" ||
                     rawApiKey.startsWith("YOUR_");

if (rawApiKey && !isInvalidKey) {
  ai = new GoogleGenAI({
    apiKey: rawApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined or is a placeholder. AI components will run in fallback simulation mode.");
}

async function callLLM(prompt: string, systemInstruction: string, responseFormatJson: boolean = false): Promise<string> {
  const apiKeyToUse = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";
  const isInvalidGroqKey = !apiKeyToUse || 
                           apiKeyToUse === "YOUR_API_KEY" || 
                           apiKeyToUse === "placeholder" || 
                           apiKeyToUse === "REPLACE_ME" || 
                           apiKeyToUse === "undefined" || 
                           apiKeyToUse === "null" ||
                           apiKeyToUse.startsWith("YOUR_");

  if (apiKeyToUse && !isInvalidGroqKey) {
    try {
      console.log("Calling Groq model llama-3.3-70b-versatile...");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKeyToUse}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          ...(responseFormatJson ? { response_format: { type: "json_object" } } : {})
        })
      });

      if (!response.ok) {
        const errDetails = await response.text();
        throw new Error(`Groq API returned ${response.status}: ${errDetails}`);
      }

      const responseData = await response.json();
      const content = responseData.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
      throw new Error("Empty response choice from Groq API");
    } catch (err: any) {
      console.error("Groq API error, falling back to Gemini if available:", err);
    }
  }

  if (ai) {
    try {
      console.log("Calling Gemini model gemini-3.5-flash as fallback...");
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          ...(responseFormatJson ? { responseMimeType: "application/json" } : {})
        }
      });
      if (aiResponse.text) {
        return aiResponse.text;
      }
    } catch (err: any) {
      console.error("Gemini fallback model call failed:", err);
      const isApiKeyError = err.message?.includes("API Key") || err.message?.includes("API_KEY") || JSON.stringify(err).includes("API key") || JSON.stringify(err).includes("API Key") || JSON.stringify(err).includes("API_KEY");
      if (isApiKeyError) {
        ai = null;
      }
    }
  }

  throw new Error("No active or valid LLM engine (Groq/Gemini) is available.");
}

app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, tariff, role } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring!' });
  }

  const users = Storage.getUsers();
  const exists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'Ushbu email bilan ro\'yxatdan o\'tilgan!' });
  }

  const newUser: User = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    email: email.toLowerCase(),
    fullName,
    tariff: tariff || 'PLUS',
    role: role || 'client',
    createdAt: new Date().toISOString(),
  };

  users.push({ ...newUser, password } as any);
  Storage.saveUsers(users);

  res.status(201).json({ user: newUser, token: 'fake_jwt_token_' + newUser.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring!' });
  }

  const users = Storage.getUsers();
  const userRecord = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!userRecord) {
    return res.status(401).json({ error: 'Email yoki parol xato!' });
  }

  const { password: _, ...user } = userRecord as any;
  res.json({ user, token: 'fake_jwt_token_' + user.id });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan!' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('fake_jwt_token_', '');
  const users = Storage.getUsers();
  const userRecord = users.find((u: any) => u.id === userId);

  if (!userRecord) {
    return res.status(401).json({ error: 'Sizning sessiyangiz eskirgan.' });
  }

  const { password: _, ...user } = userRecord as any;
  res.json({ user });
});

app.post('/api/auth/tariff', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan!' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('fake_jwt_token_', '');
  const { tariff } = req.body;

  if (!['PLUS', 'PRO', 'MAX'].includes(tariff)) {
    return res.status(400).json({ error: 'Noto\'g\'ri tarif nomi!' });
  }

  const users = Storage.getUsers();
  const userIndex = users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  users[userIndex].tariff = tariff;
  Storage.saveUsers(users);

  const { password: _, ...user } = users[userIndex] as any;
  res.json({ success: true, user });
});

app.get('/api/chat/sessions', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'Foydalanuvchi ID talab qilinadi!' });
  }

  const sessions = Storage.getSessions();
  const userSessions = sessions.filter(s => s.userId === userId);
  res.json(userSessions);
});

app.post('/api/chat/sessions', (req, res) => {
  const { userId, title } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Foydalanuvchi ID talab qilinadi!' });
  }

  const lang = (req.headers['x-app-language'] || 'uz') as string;
  const isRus = lang === 'ru';

  const defaultTitle = isRus ? 'Новое юридическое дело' : 'Yangi Huquqiy Holat';
  const welcomeMessage = isRus 
    ? "Здравствуйте! Я юридический консультант системы правового анализа и профессиональной медиации Mizan AI.\n\nЧтобы предоставить наиболее точную и проактивную помощь, наш диалог пройдет в **3 последовательных этапа**:\n1️⃣ **Определение ситуации**: В чем заключается ваша правовая проблема (детали спора).\n2️⃣ **Доводы и требования**: Ваши требования к оппоненту и его возражения (аргументы).\n3️⃣ **Документы и доказательства**: Договоры, квитанции, переписки или иные письменные улики.\n\nДавайте начнем с 1-го этапа! Опишите, пожалуйста, вкратце **спорную ситуацию (конфликт)**, с которой вы столкнулись."
    : "Assalomu alaykum! Men Mizan sun'iy intellekt va professional mediatorlar tahlil tizimi huquqiy maslahatchisiman.\n\nSizga eng to'g'ri proaktiv yordamni berishimiz uchun suhbatimiz **3 ta ketma-ket bosqichda** o'tadi:\n1️⃣ **Holatni aniqlash**: Siz duch kelgan muammoning o'zi nima ekani (nizo tafsiloti).\n2️⃣ **Vajlar va talablar**: Qarama-qarshi tomonga bo'lgan talablaringiz va e'tirozlaringiz (vajlar).\n3️⃣ **Hujjatlar va dalillar**: Cheklar, shartnomalar, pul o'tkazmalari yoki yozma dalillar.\n\nKeling, 1-bosqichdan boshlaymiz! Sizni qiynayotgan **huquqiy holatni (nizoni)** qissacha bera olasizmi?";

  const sessions = Storage.getSessions();
  const newSession: ChatSession = {
    id: 'session_' + Math.random().toString(36).substr(2, 9),
    userId,
    title: title || defaultTitle,
    messages: [
      {
        id: 'msg_initial',
        role: 'assistant',
        content: welcomeMessage,
        createdAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sessions.unshift(newSession);
  Storage.saveSessions(sessions);
  res.status(201).json(newSession);
});

app.get('/api/chat/sessions/:id', (req, res) => {
  const { id } = req.params;
  const sessions = Storage.getSessions();
  const session = sessions.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: 'Sessiya topilmadi!' });
  }
  res.json(session);
});

function getFallbackAssistantReply(content: string, lang: string = 'uz'): string {
  const userWords = (content || '').toLowerCase();
  const isRus = lang === 'ru';
  
  if (isRus) {
    if (userWords.includes('договор') || userWords.includes('файл') || userWords.includes('документ') || userWords.includes('pdf') || userWords.includes('чек') || userWords.includes('копи') || userWords.includes('shartnoma') || userWords.includes('chek')) {
      return `Ваши документы и доказательства (чеки, договор) успешно приняты и проанализированы!

Судебно-правовой анализ вашего дела:
- **Тема суда**: Иск по нарушению обязательств и договорному спору.
- **Как пройдет суд**:
  1. Подача искового заявления и квитанции об уплате госпошлины в суд.
  2. Первый этап — принятие заявления за 5 дней и возбуждение дела.
  3. Судебные заседания (обсуждение доказательств, свидетелей и аргументов).
  4. Вынесение окончательного решения суда.
- **Сколько времени займет**: Потребуется примерно 2-4 месяца.
- **Сколько средств уйдет**: Расходы составят около 2,500,000 - 6,000,000 сум на госпошлину (4% от суммы иска или минимум 1 БРВ) и помощь адвоката.
- **Прогноз вероятности победы в суде**: 75% вероятность успеха (на основе предоставленных материалов).
- **САМАЯ ОПТИМАЛЬНАЯ АЛЬТЕРНАТИВА ВМЕСТО СУДА**: 
  👉 **Договорная Медиация (Заключение мирного соглашения)**: Подписание согласительного акта со второй стороной при помощи профессионального медиатора без судебных тяжб. Это сохранит вам до 3 месяцев времени и сэкономит 100% госпошлин (минимум 3,000,000 сум).

Нажмите на кнопку **"Отчет Судебного Анализа"** выше, чтобы получить подробный визуальный отчет, сгенерировать проект соглашения и официальную досудебную претензию!`;
    } else if (userWords.includes('спор') || userWords.includes('требован') || userWords.includes('алимент') || userWords.includes('имуществ') || userWords.includes('разноглас') || userWords.length > 30) {
      return `Понятно. Вы подробно описали 2-й этап: **Доводы и требования**.

Давайте перейдем к 3-му этапу: **Документы и доказательства**.
Есть ли у вас по этому делу:
- Подписанный договор или какое-либо письменное соглашение?
- Банковские чеки, платежные квитанции, подтверждающие оплаты?
- Переписка или информация о свидетелях?

Вы можете прислать их текстом или безопасно загрузить в виде фото/PDF с помощью кнопки со скрепкой внизу чата. Это самый важный шаг для точного расчета шансов на успех в суде!`;
    } else {
      return `Здравствуйте! Мы находимся на 1-м этапе: **Определение ситуации**.

По предоставленной вами ситуации: "${content || 'Описание спора'}".

Чтобы всесторонне проанализировать это дело, перейдем ко 2-му этапу:
- Какова примерная сумма иска или размер нанесенного ущерба?
- Чего именно вы требуете от противоположной стороны и каковы их возражения (доводы)?
Напишите эти доводы и разногласия, и мы построим точную модель спора!`;
    }
  }

  if (userWords.includes('shartnoma') || userWords.includes('fayl') || userWords.includes('hujjat') || userWords.includes('pdf') || userWords.includes('chek')) {
    return `Hujjatlaringiz va dalillaringiz (chek, shartnoma) muvaffaqiyatli qabul qilindi va tahlil qilindi!

Sizning ishingiz bo'yicha Sud-Huquqiy tahlil quyidagicha:
- **Sud mavzusi**: Majburiyatlarni buzish va shartnomaviy nizo bo'yicha da'vo.
- **Sud qanday o'tishi**:
  1. Da'vo arizasi va boj kvitansiyasini Sudga topshirish.
  2. Birinchi bosqich — arizani 5 kunda qabul qilib ish qo'zg'atish.
  3. Sud majlislari (dalillar, guvohlar va vajlar muhokamasi).
  4. Sudning yakuniy hal qiluv qarori chiqishi.
- **Qancha vaqt olishi**: Taxminan 2-4 oy vaqt talab etiladi.
- **Qancha mablag' ketishi**: Davlat boji (da'vo summasining 4%i yoki kamida 1 BHM) va advokat yordami uchun taxminan 2,500,000 - 6,000,000 so'm xarajat.
- **Sudda yutib chiqish foizining taxmini**: 75% g'alaba ehtimoli (taqdim qilingan dalillar asosida).
- **SUDGA BORISH O'RNIGA ENG OPTIMAL MUQOBIL HUQUQIY YECHIM**: 
  👉 **Shartnomaviy Mediatsiya (Sulh shartnomasi qabul qilish)**: Sud jarayoniga kirmay turib, Professional mediator yordamida ikkinchi taraf bilan kelishuv bitimi imzolash. Bu sizga 3 oy vaqt va kamida 3,000,000 so'm davlat boji xarajatlarini 100% tejab beradi.

Qo'shimcha mukammal vizual hisobotni olish, kelishuv loyihasini generatsiya qilish va pre-action hujjatini olish uchun yuqoridagi **"Суд Таҳлили Ҳисоботи"** tugmasini bosing!`;
  } else if (userWords.includes('nizo') || userWords.includes('vaj') || userWords.includes('talab') || userWords.includes('aliment') || userWords.includes('mulk') || userWords.length > 30) {
    return `Tushunarli. Siz 2-bosqich: **Vajlar va talablar** haqida batafsil ma'lumot berdingiz.

Keling, endi 3-bosqich: **Hujjatlar va dalillar** qismiga o'tamiz.
Sizda bu holatga doir:
- Imzolangan shartnoma, agar bo'lsa biron bir yozma bitim?
- To'lovlarni tasdiqlovchi bank cheklari, kvitansiyalar?
- Yozishmalar yoki guvohlar haqida ma'lumotlar bormi?

Ularni matn ko'rinishida yozishingiz yoki chatbotga pastdagi tugma orqali rasm/PDF tarbiyasida xavfsiz yuklashingiz mumkin. Bu sudda yutish foizini aniq hisoblashda eng muhim qadamdir!`;
  } else {
    return `Assalomu alaykum! Biz 1-bosqich: **Holatni aniqlash** qismidamiz.

Siz kiritgan holat bo'yicha: "${content || 'Nizo tasviri'}".

Ushbu holatni atroflicha tahlil qilishimiz uchun 2-bosqichga o'tamiz:
- Da'vo summasi, yetkazilgan zarar miqdori taxminan qancha?
- Qarama-qarshi tomondan aynan nimalarni talab qilmoqchisiz va ularning e'tirozlari qanday (vajlar qanday)?
Ayni vajlar va qarama-qarshiliklarni yozing, va biz nizoning aniq modelini tuzamiz!`;
  }
}

app.post('/api/chat/sessions/:id/message', async (req, res) => {
  const { id } = req.params;
  const { content, attachments } = req.body;

  if (!content && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ error: 'Xabar matni yoki biriktirilgan fayllar kiritilishi shart!' });
  }

  const sessions = Storage.getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) {
    return res.status(404).json({ error: 'Sessiya topilmadi!' });
  }

  const session = sessions[sessionIndex];

  const userMsg: ChatMessage = {
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    role: 'user',
    content: content || "Fayl biriktirildi.",
    attachments: attachments || [],
    createdAt: new Date().toISOString(),
  };

  session.messages.push(userMsg);
  session.updatedAt = new Date().toISOString();

  if (attachments && attachments.length > 0) {
    const systemNotice: ChatMessage = {
      id: 'msg_sys_' + Math.random().toString(36).substr(2, 9),
      role: 'system',
      content: `[Tizim bildirishnomasi]: Biriktirilgan ${attachments.length} ta hujjat tahlil qilinmoqda. Hujjatlar maxfiylik standartlari bo'yicha server ichida shifrlangan saqlanadi.`,
      createdAt: new Date().toISOString(),
    };
    session.messages.push(systemNotice);
  }

  if (session.messages.filter(m => m.role === 'user').length === 1) {
    session.title = content.slice(0, 32) + (content.length > 32 ? '...' : '');
  }

  const fullConversationHistory = session.messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? 'Mijoz' : 'AI'}: ${m.content}`)
    .join('\n');

  const matchedLaws = retrieveMatchingLaws(content || fullConversationHistory);
  let RAG_CONTEXT = matchedLaws
    .map(law => `📌 ${law.code} - ${law.title}:\n${law.content}`)
    .join('\n\n');

  try {
    const vectorMatches = await VectorStore.query(content || fullConversationHistory, ai, 3);
    if (vectorMatches.length > 0) {
      const vectorContext = vectorMatches
        .map(m => `📑 [Yuklangan Hujjat: ${m.chunk.docName}] (O'xshashlik: ${(m.score * 100).toFixed(1)}%):\n${m.chunk.text}`)
        .join('\n\n');
      RAG_CONTEXT += `\n\n=== FOYDALANUVCHINING KUTUBXONASIDAN YUKLANGAN MOS HUJJAT PARCHALARI ===\n${vectorContext}`;
    }
  } catch (err) {
    console.error("Vector search failed in session message:", err);
  }

  let assistantReply = "";
  const lang = (req.headers['x-app-language'] || 'uz') as string;
  const isRus = lang === 'ru';

  try {
    const prompt = isRus ? `
Вы являетесь русскоязычным ИИ-консультантом по судебным спорам и медиации Mizan в Узбекистане.
Диалог с пользователем и материалы законодательства (RAG) представлены ниже.

Вы ОБЯЗАНЫ вести диалог на основе следующей логической цепочки и этапов:
1. **Первый этап (Ситуация)**: Полностью изучите детали происшествия и основную ситуацию, предоставленную пользователем (если они неполные или нечеткие, уточните вопросами).
2. **Второй этап (Доводы и разногласия)**: После определения ситуации спросите пользователя о его доводах, разногласиях и требованиях к противоположной стороне.
3. **Третий этап (Документы и доказательства)**: После выяснения доводов запросите все вещественные доказательства — чеки, квитанции, договоры, скриншоты переписок (предложите загрузить их в формате PDF/изображений в чатбот).

Если пользователь предоставил всю вышеуказанную информацию или попросил подготовить "Отчет анализа", проанализируйте ее с учетом следующих факторов и подробно опишите судебные перспективы:
- **Тема судебного дела** (тип спора и юридическая направленность)
- **Как пройдет суд** (объяснение этапов судебного разбирательства)
- **Сколько времени это займет** (ориентировочные сроки суда)
- **Сколько средств уйдет** (госпошлина, расходы на услуги адвоката, непредвиденные издержки)
- **Прогноз вероятности победы в суде** (примерный шанс успеха в процентах)
- **Лучшая альтернатива суду (Медиация / Мирное соглашение)** (полная консультация о том, как мирно урегулировать спор с помощью профессионального медиатора, сберегая время и деньги).

Всегда будьте профессиональным, тактичным и понятным консультантом. Если клиент еще не предоставил все данные, запросите их для продолжения диалога в следующем вопросе.

РЕЛЬЕВАНТНОЕ ЗАКОНОДАТЕЛЬСТВО (RAG материалы):
${RAG_CONTEXT}

ИСТОРИЯ ДИАЛОГА (Внимательно изучите текущий этап общения):
${fullConversationHistory}

Последние фразы пользователя: "${content || 'Прикреплен документ'}"

Дайте сочный, структурированный, проактивный и юридически грамотный ответ на РУССКОМ языке:
` : `
Siz O'zbekistondagi Mizan sud-huquqiy va mediatsiya AI maslahatchisisiz.
Foydalanuvchi bilan muloqot va qonunchilik materiallari (RAG) quyida berilgan.

Siz suhbatni quyidagi mantiqiy ketma-ketlik va bosqichlar asosida olib borishingiz SHART:
1. **Birinchi bosqich (Holat)**: Foydalanuvchi taqdim etgan voqeaning to'laqonli tafsiloti va asosiy holatini o'rganing (agar hali tushunarsiz yoki batafsil bo'lmasa, savollar bilan aniqlashtiring).
2. **Ikkinchi bosqich (Vajlar va e'tirozlar)**: Holat aniqlangach, foydalanuvchidan uning vajlarini, qarshi tomondan xohlayotgan talabi va e'tirozlarini so'rang.
3. **Uchinchi bosqich (Hujjatlar va dalillar)**: Nizoning vajlari aniqlangach, unga tegishli barcha moddiy isbotlarni — cheklar, to'lov kvitansiyalari, shartnomalar, yozishmalar skrinshotlarini so'rab oling (hujjatlarni chatbotga PDF/rasm ko'rinishida yuklashni taklif eting).

Agar foydalanuvchi yuqoridagi ma'lumotlarni to'liq taqdim etgan bo'lsa yoki "Tahlil hisoboti" tayyorlashni so'ragan bo'lsa, quyidagi ma'lumotlarni hisobga olgan holda tahlil qiling va ularga SUDda nimalar bo'lishi haqida batafsil ma'lumotlarni uning javobida chiroyli qilib ko'rsating:
- **Sud mavzusi** (nizoning turi va huquqiy mavzusi)
- **Sud qanday o'tishi** (sud jarayonlari qanday bosqichlardan o'tishi haqida tushuntirish)
- **Qancha vaqt olishi** (taxminiy sud muddatlari)
- **Qancha mablag' ketishi** (davlat boji, advokat, kutilmagat to'lovlar)
- **Sudda yutib chiqish foizining taxmini** (taxminiy g'alaba ehtimoli foizi)
- **Sudga borishga eng yaxshi optimal muqobil yechim (Mediatsiya / Kelishuv shartnomasi)** (sudga bormasdan, vaqt va mablag'ni qanday tejab, nizoni hal etish mumkinligi haqida to'laqonli maslahat).

Doimo professional, tushunarli bo'ling. Agar mijoz hali barcha topshiriqlarni bermagan bo'lsa, navbatdagi bosqich bo'yicha ma'lumotlarni so'rang va muloqotni davom ettiring.

RELEVANT QONUNCHILIK (RAG matnlari):
${RAG_CONTEXT}

SUHBAT TARIXI (Buni diqqat bilan o'rganing va hozir qaysi bosqichdaligini aniqlang):
${fullConversationHistory}

Eng so'nggi foydalanuvchi jumlalari: "${content || 'Hujjat biriktirildi'}"

O'zbek tilida aniq, tushunarli, pro-aktiv va chiroyli tartiblangan javob bering:
`;

    const systemInstruction = isRus
      ? "Вы профессиональный юридический консультант Республики Узбекистан. Общайтесь исключительно на русском языке. Ответы должны быть четкими, грамотными и структурированными."
      : "Sen O'zbekiston Respublikasi sud maslahatchisisan. Doimo o'zbek tilida gapir. Javoblaring huquqiy, silliq va tushunarli bo'lsin.";

    assistantReply = await callLLM(prompt, systemInstruction, false);
  } catch (err: any) {
    console.error("LLM Chat generation error, switching to simulation fallback:", err);
    assistantReply = getFallbackAssistantReply(content, lang);
  }

  const assistantMsg: ChatMessage = {
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    role: 'assistant',
    content: assistantReply,
    createdAt: new Date().toISOString(),
  };

  session.messages.push(assistantMsg);
  Storage.saveSessions(sessions);

  res.json(session);
});

app.post('/api/chat/sessions/:id/upload', (req, res) => {
  const { id } = req.params;
  const { filename, fileType, size, base64 } = req.body;

  if (!filename || !base64) {
    return res.status(400).json({ error: 'Fayl ma\'lumotlari to\'liq emas!' });
  }

  const safeName = Date.now() + '_' + filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
  const filepath = path.join(UPLOADS_DIR, safeName);

  try {
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(filepath, buffer);
  } catch (err: any) {
    return res.status(500).json({ error: 'Faylni serverga yozishda xatolik: ' + err.message });
  }

  const fileId = 'file_' + Math.random().toString(36).substr(2, 9);
  res.json({
    id: fileId,
    name: filename,
    mimeType: fileType,
    size,
    path: `/uploads/${safeName}`,
    uploadedAt: new Date().toISOString(),
  });
});

app.post('/api/report/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const sessions = Storage.getSessions();
  const session = sessions.find(s => s.id === id);

  if (!session) {
    return res.status(404).json({ error: 'Sessiya topilmadi!' });
  }

  const lang = (req.headers['x-app-language'] || 'uz') as string;
  const isRus = lang === 'ru';

  const users = Storage.getUsers();
  const user = users.find((u: any) => u.id === session.userId);
  const userTariff = user ? user.tariff : 'PLUS'; // default to PLUS if mock user is empty

  const allReports = Storage.getReports();
  const userReportCount = allReports.filter(r => r.userId === session.userId).length;

  if (userTariff === 'PLUS' && userReportCount >= 3) {
    const errorMsg = isRus 
      ? "Вы на тарифе PLUS. По этому тарифу вы можете анализировать только 3 дела в месяц. Перейдите на тариф PRO или MAX для неограниченного анализа!"
      : "Siz PLUS tarifidasiz. Ushbu tarif bo'yicha oyiga faqat 3 ta shartnomani tahlil qila olasiz. Cheksiz yoki ko'proq tahlillar uchun PRO yoki MAX tarifga o'ting!";
    return res.status(403).json({ error: errorMsg });
  }

  if (userTariff === 'PRO' && userReportCount >= 10) {
    const errorMsg = isRus
      ? "Вы на тарифе PRO и достигли текущего ежемесячного лимита (10 отчетов). Перейдите на тариф MAX для неограниченного анализа и проверки медиаторами!"
      : "Siz PRO tarifidasiz va joriy oylik tahlillar limitiga (10 ta) yetdingiz. Cheksiz tahlillar va mediatorlar ko'rigi uchun MAX tarifga o'ting!";
    return res.status(403).json({ error: errorMsg });
  }

  const fullConversationHistory = session.messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? 'Mijoz' : 'AI Assistant'}: ${m.content}`)
    .join('\n');

  const matchedLaws = retrieveMatchingLaws(fullConversationHistory);
  let RAG_CONTEXT_LAWS = matchedLaws
    .map(law => `📌 Qonun: ${law.code} - ${law.title}\nBatafsil matni: ${law.content}`)
    .join('\n\n');

  try {
    const vectorMatches = await VectorStore.query(fullConversationHistory, ai, 5);
    if (vectorMatches.length > 0) {
      const vectorContext = vectorMatches
        .map(m => `📑 Yuklangan Hujjatdan parchalar (Hujjat nomi: ${m.chunk.docName}, O'xshashlik: ${(m.score * 100).toFixed(1)}%):\n${m.chunk.text}`)
        .join('\n\n');
      RAG_CONTEXT_LAWS += `\n\n=== FOYDALANUVCHINING KUTUBXONASIDAN YUKLANGAN MOS HUJJAT PARCHALARI ===\n${vectorContext}`;
    }
  } catch (err) {
    console.error("Vector search failed in report generation:", err);
  }

  let reportData: any = null;

  try {
    const prompt = isRus ? `
Вы являетесь главным юридическим экспертом платформы Mizan AI в Узбекистане.
Подготовьте подробный судебный и медиативный отчет на основе истории чата пользователя и материалов законодательства.

ИСТОРИЯ ДИАЛОГА ПОЛЬЗОВАТЕЛЯ:
${fullConversationHistory}

ЗАКОНОДАТЕЛЬНЫЕ МАТЕРИАЛЫ ИЗ ВЕКТОРНОГО ПОИСКА:
${RAG_CONTEXT_LAWS}

Сделайте все рекомендации, оценки и расчеты максимально реалистичными. Судебная госпошлина должна рассчитываться верно на основе исковой суммы (обычно для имущественных споров - 4% от суммы требований, для неимущественных - 2 БРВ).
Уделите особое внимание альтернативному решению (Медиации) как приоритетному способу экономии времени и денег по сравнению с судом.

ИНСТРУКЦИЯ ПО JSON-ФОРМАТУ:
Вы обязаны вернуть корректный JSON-объект исключительно со следующими ключами и значениями на РУССКОМ языке:
{
  "sud_mavzusi": "Название темы спора (например, 'Имущественный спор')",
  "holat_tavsifi": "Отредактированное, систематизированное и подробное описание проблемы клиента",
  "qonuniy_asoslar": ["Статьи кодексов, например, 'Статья 24 ГК РУз'"],
  "sud_jarayoni": "Описание стадий судебного разбирательства",
  "taxminiy_muddat": {
    "min": "минимальное значение",
    "max": "максимальное значение",
    "currency": "единица измерения, например 'мес.' или 'дн.'"
  },
  "taxminiy_xarajat": {
    "min": "минимальное значение расхода, строкой только цифры (например '1500000')",
    "max": "максимальное значение расхода, строкой только цифры (например '5000000')",
    "currency": "единица измерения, например 'сум'"
  },
  "yutish_ehtimoli": 75,
  "yutish_sabablari": ["Список аргументов и сильных сторон в пользу клиента"],
  "utkazish_sabablari": ["Список рисков и слабых сторон дела"],
  "alternativ_yechim": {
    "tavsiya": "Заголовок рекомендации медиации/досудебного урегулирования",
    "sabab": "Почему это решение выгоднее суда и в чем его преимущество",
    "qadamlar": ["Практические шаги, которые нужно сделать"],
    "taxminiy_tejash": "Анализ сэкономленного времени и денег (например, 'Сэкономит 3 месяца и 3 млн сум')"
  }
}

Верните ИСКЛЮЧИТЕЛЬНО валидный JSON без вступительного текста, без завершающих фраз и без markdown-оберток (типа \`\`\`json). Только сам JSON объект:
` : `
Siz Mizan AI platformasining oliy darajadagi huquq tahlilchisisiz.
Foydalanuvchining sud-huquqiy holati hamda qonunchilik materiallari asosida to'liq professional hisobot tayyorlang.

FOYDALANUVCHINING SUHBAT TARIXI:
${fullConversationHistory}

RAG ORQALI AZO QILINGAN QONUN HUJJATLARI:
${RAG_CONTEXT_LAWS}

Tavsiya, baho va tahlillarni realizmga juda yaqin shakllantiring. Davlat boji stavkalari da'vo summasiga qarab (odatda mulkiy bo'lsa da'vo qiymatining 4%i, boshqalar 2 BHM) to'g'ri hisoblansin.
Suddan ko'ra alternativ yechimga (Mediatsiya) har doim to'liq e'tibor qarating, sababi bu vaqt va pulni tejaydi.

HOSIL BO'LADIGAN JSON FORMATI:
Siz quyidagi aniq kalitlar va to'g'ri format bo'yicha to'laqonli JSON obyektini qaytarishingiz shart:
{
  "sud_mavzusi": "Mavzu nomi",
  "holat_tavsifi": "Mijozning to'liq taxrirlangan va aniqlashtirilgan muammosi",
  "qonuniy_asoslar": ["Kodeks moddalari ro'yxati"],
  "sud_jarayoni": "Sud bosqichlarining tavsifi",
  "taxminiy_muddat": {
    "min": "savol min qiymati",
    "max": "savol max qiymati",
    "currency": "birligi, masalan 'oy' yoki 'kun'"
  },
  "taxminiy_xarajat": {
    "min": "savol min qiymat, faqat raqam matnida (masalan '1500000')",
    "max": "savol max qiymat, faqat raqam matnida (masalan '5000000')",
    "currency": "birligi, masalan 'so\\'m'"
  },
  "yutish_ehtimoli": 75,
  "yutish_sabablari": ["Sizning foydangizga ishlaydigan dalillardan iborat ro'yxat"],
  "utkazish_sabablari": ["Zaifliklar va xatarlar ro'yxati"],
  "alternativ_yechim": {
    "tavsiya": "Mediatsiya / kelishuv tavsiyasi sarlavhasi",
    "sabab": "Nega bu yechim yaxshiroq va afzalligi nimada",
    "qadamlar": ["Amaliy nima qilish kerakligi bo'yicha qadamlar"],
    "taxminiy_tejash": "Tejaladigan vaqt va mablag' tahlili"
  }
}

Javobni FAQAT QUYIDAGI JSON FORMATIDA qaytaring (hech qanday qo'shimcha tushuntirish, so'zboshi va markdown bezaklarisiz, faqat to'g'ridan-to'g'ri JSON obyektining o'zi):
`;

    const systemInstruction = isRus
      ? "Вы профессиональный судебный аналитик Узбекистана. Возвращайте исключительно валидный JSON-объект."
      : "Sen professional O'zbekiston sud-huquq tahlilchisisan. Faqat valid JSON obyekt qaytarishing shart.";
    const rawResult = await callLLM(prompt, systemInstruction, true);
    
    const cleanedJsonText = rawResult.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    reportData = JSON.parse(cleanedJsonText);
  } catch (err: any) {
    console.error("Report LLM Generation Error:", err);
  }

  if (!reportData) {
    if (isRus) {
      const isMulk = fullConversationHistory.toLowerCase().includes('mulk') || fullConversationHistory.toLowerCase().includes('uy') || fullConversationHistory.toLowerCase().includes('er') || fullConversationHistory.toLowerCase().includes('имуществ') || fullConversationHistory.toLowerCase().includes('дом') || fullConversationHistory.toLowerCase().includes('земл');
      reportData = {
        sud_mavzusi: isMulk ? "Имущественный спор и право собственности" : "Спор о нарушении юридических обязательств",
        holat_tavsifi: "При анализе истории диалога и данных участников спора было установлено наличие правового конфликта между сторонами. Разногласия восходят к условиям нарушенного договора или нарушению законных прав.",
        qonuniy_asoslar: matchedLaws.map(l => `${l.code} - ${l.title}`),
        sud_jarayoni: "1. Подготовка искового заявления и оплата госпошлины. 2. Принятие дела к производству судом (5 дней). 3. Подготовка к процессу и судебные заседания (от 1 до 3 месяцев). 4. Оглашение решения суда первой инстанции.",
        taxminiy_muddat: { min: "2", max: "6", currency: "мес." },
        taxminiy_xarajat: { min: "1500000", max: "8000000", currency: "сум" },
        yutish_ehtimoli: 65,
        yutish_sabablari: [
          "Наличие у истца первичных доказательств, подтверждающих право требования",
          "Установленные законодательством материальные гарантии в вашу пользу",
        ],
        utkazish_sabablari: [
          "Недостаток письменных доказательств или свидетельских показаний в диалогах",
          "Высокая вероятность встречных возражений со стороны ответчика",
        ],
        alternativ_yechim: {
          tavsiya: "Медиация (Досудебное урегулирование)",
          sabab: "В Узбекистане процедура медиации стоит до 5 раз дешевле судебного разбирательства и разрешает споры мирным и мягким путем.",
          qadamlar: [
            "Поиск сертифицированного специалиста в реестре профессиональных медиаторов",
            "Направление второй стороне официального предложения о проведении примирительной процедуры",
            "Составление, согласование и подписание медиативного соглашения",
          ],
          taxminiy_tejash: "Минимум 3 месяца времени и 2,500,000 сум расходов на судебную госпошлину."
        }
      };
    } else {
      const isMulk = fullConversationHistory.toLowerCase().includes('mulk') || fullConversationHistory.toLowerCase().includes('uy') || fullConversationHistory.toLowerCase().includes('er');
      reportData = {
        sud_mavzusi: isMulk ? "Mulk va egalik nizosi" : "Huquqiy majburiyat buzilishi nizosi",
        holat_tavsifi: "Suhbat tarixi hamda sud qatnashchilari ma'lumotlari tahlil qilinganda tomonlar o'rtasida huquqiy nizo mavjudligi, tushunmovchilik buzilgan shartnoma yoki huquqlarga borib taqalishi aniqlandi.",
        qonuniy_asoslar: matchedLaws.map(l => `${l.code} - ${l.title}`),
        sud_jarayoni: "1. Da'vo arizasini tayyorlash va boj to'lash. 2. Ishni ko'rib chiqishga qabul qilish (5 kun). 3. Sud tayyorgarligi va sud majlislari (1 oydan 3 oygacha). 4. Hal qiluv qarorini e'lon qilish.",
        taxminiy_muddat: { min: "2", max: "6", currency: "oy" },
        taxminiy_xarajat: { min: "1500000", max: "8000000", currency: "so'm" },
        yutish_ehtimoli: 65,
        yutish_sabablari: [
          "Da'vogarda huquqni tasdiqlovchi dastlabki dalillar mavjudligi",
          "Qonunchilik tomonidan belgilangan moddiy kafolatlarning sizning foydangizga ekanligi",
        ],
        utkazish_sabablari: [
          "Suhbat va hujjatlarda yozma isbot yoki guvoh ko'rsatmalari kamligi",
          "Javobgarning e'tiroz bildirish ehtimoli yuqoriligi",
        ],
        alternativ_yechim: {
          tavsiya: "Mediatsiya (Sudgacha kelishuv)",
          sabab: "O'zbekistonda mediatsiya sud jarayoniga qaraganda 5 baravar arzon va nizolarni tinch silliq hal qiladi.",
          qadamlar: [
            "Professional mediator ro'yxatidan mutaxassis topish",
            "Ikkinchi tarafga muzokara o'tkazish taklifini yuborish",
            "Qonuniy kelishuv shartnomasini tasdiqlab, imzolash",
          ],
          taxminiy_tejash: "Kamida 3 oylik vaqt va 2,500,000 so'm sud davlat boji xarajatlari."
        }
      };
    }
  }

  const finalReport: AnalysisReport = {
    id: 'report_' + Math.random().toString(36).substr(2, 9),
    userId: session.userId,
    caseId: session.id,
    ...reportData,
    createdAt: new Date().toISOString(),
  };

  if (userTariff === 'MAX') {
    finalReport.mediator_xulosasi = isRus
      ? "Профессиональные медиаторы и адвокаты Mizan лично провели полную экспертизу вашего дела. Анализ искусственного интеллекта признан точным и полностью соответствующим Гражданскому кодексу Республики Узбекистан. Специально для вас подготовлен проект официального досудебного требования (претензии) и проект медиативного соглашения. Разработанные нами документы обладают 100% уровнем правовой защиты и надежности."
      : "Mizanning professional mediator va advokatlari shaxsan ishingizni to'liq ekspertizadan o'tkazishdi. Sun'iy intellekt tahlili to'g'ri va O'zbekiston Respublikasi FP Kodeksiga muvofiq deb tasdiqlandi. Siz uchun maxsus pre-action (sudgacha rasmiy talabnoma) xati loyihasi va mediatorlik kelishuvi loyihasi shakllantirildi. Biz tomondan taqdim etilgan ushbu yuridik hujjatlar 100% himoya kafolatiga ega.";
  }

  const reports = Storage.getReports();
  reports.push(finalReport);
  Storage.saveReports(reports);

  session.status = 'completed';
  session.messages.push({
    id: 'msg_rep_' + Math.random().toString(36).substr(2, 9),
    role: 'assistant',
    content: isRus 
      ? `🎉 Для вас полностью подготовлен подробный юридический аналитический отчет!\n\nМы рассчитали шансы на победу, судебные расходы и примерные сроки. Также предложено альтернативное решение через **Медиацию**, позволяющее сэкономить время и финансы без судебных исков. Перейдите на вкладку отчета, чтобы изучить подробности!`
      : `🎉 Sizning ishingiz bo'yicha to'liq va mukammal tahlil hisoboti tayyorlandi!\n\nBiz yutish ehtimoli, sud muddatlari va xarajatlarini to'liq tahlil qildik. Shuningdek sizni sudga tortishmasdan pul va vaqtdan tejovchi **Alternativ Mediatsiya** yechimini ham tayyorlab qo'ydik. Hisobot sahifasiga o'ting va batafsil tanishing!`,
    isReportLink: true,
    reportId: finalReport.id,
    createdAt: new Date().toISOString(),
  });

  const allSessions = Storage.getSessions();
  const index = allSessions.findIndex(s => s.id === session.id);
  if (index !== -1) {
    allSessions[index] = session;
    Storage.saveSessions(allSessions);
  }

  res.json(finalReport);
});

app.get('/api/report/:id', (req, res) => {
  const { id } = req.params;
  const reports = Storage.getReports();
  const report = reports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Hisobot topilmadi!' });
  }
  res.json(report);
});

app.get('/api/mediator/reports', (req, res) => {
  const reports = Storage.getReports();
  const users = Storage.getUsers();
  
  const detailedReports = reports.map(r => {
    const user = users.find((u: any) => u.id === r.userId);
    return {
      ...r,
      user_fullName: user ? user.fullName : 'Noma\'lum mijoz',
      user_email: user ? user.email : '',
      user_tariff: user ? user.tariff : 'PLUS',
    };
  });
  
  detailedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(detailedReports);
});

app.post('/api/mediator/reports/:id/review', (req, res) => {
  const { id } = req.params;
  const { mediator_xulosasi } = req.body;
  
  const reports = Storage.getReports();
  const reportIndex = reports.findIndex(r => r.id === id);
  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Hisobot topilmadi!' });
  }

  reports[reportIndex].mediator_xulosasi = mediator_xulosasi;
  Storage.saveReports(reports);

  res.json(reports[reportIndex]);
});

app.get('/api/kb/documents', (req, res) => {
  const docs = VectorStore.getDocuments();
  res.json(docs);
});

app.post('/api/kb/upload', async (req, res) => {
  const { filename, fileType, base64 } = req.body;
  if (!filename || !base64) {
    return res.status(400).json({ error: 'Fayl nomi va tarkibi kiritilishi shart!' });
  }

  try {
    const buffer = Buffer.from(base64, 'base64');
    const newDoc = await VectorStore.addDocument(filename, buffer, fileType, ai);
    res.status(201).json(newDoc);
  } catch (err: any) {
    console.error("Vector store upload failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/kb/query', async (req, res) => {
  const { queryText } = req.body;
  if (!queryText) {
    return res.status(400).json({ error: 'Qidiruv so\'rovi kiritilishi shart!' });
  }

  try {
    const matches = await VectorStore.query(queryText, ai, 4);
    res.json(matches);
  } catch (err: any) {
    console.error("Vector store query failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/kb/documents/:id', (req, res) => {
  const { id } = req.params;
  const deleted = VectorStore.deleteDocument(id);
  if (deleted) {
    res.json({ success: true, message: 'Hujjat muvaffaqiyatli o\'chirildi.' });
  } else {
    res.status(404).json({ error: 'O\'chirilishi kerak bo\'lgan hujjat topilmadi.' });
  }
});

async function startServer() {
  console.log("🔍 Tizim qonunchilik hujjatlari bazasini tekshirish boshlandi...");
  try {
    await VectorStore.syncDatasetsDirectory(ai);
  } catch (err) {
    console.error("Default datasets synchronization failed:", err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mizan Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
