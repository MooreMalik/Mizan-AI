# ⚖️ Mizan AI – Yuridik va Mediatsiya Tahlil Platformasi

Mizan AI — bu sudlashuvdan oldin sun'iy intellekt va RAG (Retrieval-Augmented Generation) texnologiyasi yordamida O'zbekiston Respublikasi qonunchiligi asosida huquqiy tahlil taqdim etuvchi zamonaviy platforma.

Platformaning asosiy maqsadi fuqarolar va biznes vakillarini qimmat va uzoq davom etadigan sud jarayonlaridan asrab, ularga vaqt hamda mablag'ni tejaydigan **Mediatsiya (sudgacha tinch yo'l bilan hal qilish)** ni taklif qilishdir.

---

## 🎯 Biznes Mantiq va Loyiha Maqsadi (Business Logic)
Sud jarayonlari odatda ko'p xarajat (davlat boji, advokat to'lovlari) va katta vaqt (oylab navbatlar) talab etadi. Ko'pchilik o'zining suddagi haqiqiy yutish imkoniyatlarini va qancha xarajatga tushishini bilmaydi.
**Mizan AI shu muammoni hal qiladi:**
1. Mijoz bilan suhbat orqali nizoni o'rganadi.
2. O'zining huquqiy bazasidan (O'zR Qonunlari va Kodekslari) va AI tajribasidan kelib chiqib ishni tahlil qiladi.
3. Sud qancha muddat cho'zilishi, qancha xarajat talab etishi va yutish ehtimolini hisoblab beradi.
4. **Alternativ yechim** sifatida professional mediatorlarni taklif qiladi, bu esa sudga nisbatan 5 barobargacha arzon va tezroqdir.

---

## 🚀 Asosiy Imkoniyatlar (Features)
- **Ochiq AI Chat (3-bosqichli tahlil)**: Sun'iy intellekt foydalanuvchida qadamba-qadam vaziyat, talablar va dalillarni so'raydi. (O'zbek va Rus tillarida to'liq moslashgan).
- **Hujjat Yuklash**: Dalillar, shartnomalar, va cheklarni yuklash va ularning AI tomonidan tahlil qilinishi.
- **RAG Texnologiyasi**: Foydalanuvchi yozgan matn va kalit so'zlarga asosan Mizan AI maxsus Vektor Baza ichidagi O'zR qonunchiligi moddalarini izlaydi va promptni shu asosda boyitadi.
- **Batafsil Hisobot (Report)**: RAG va Gemini AI orqali har bir huquqiy keys uchun JSON formatida aniq tahlilnoma generatsiya qilinadi. Unda quyidagilar aks etadi:
  - Huquqiy muammo va tayanch kod/qonun moddalari.
  - Sudning taxminiy muddati va ehtimoliy xarajatlar.
  - Suddagi yutish foizi va uning sabablari.
  - Eng optimal variant sifatida Mediatsiya taklifi va uning tejamkorligi.
- **Tariflar va Limitlar**: PLUS (oyiga 3 ta analiz), PRO (oyiga 10 ta), MAX (cheksiz + maxsus mediator ko'rigi).
- **Interaktiv Dizayn**: Dark va Light mode, hamkorda chiroyli animatsiyali Tailwind interfeysi.

---

## 💻 Texnik Stek (Tech Stack)

**Frontend:**
- **Fraymvork**: React 18+ (Vite).
- **Til**: TypeScript.
- **Styling**: Tailwind CSS (maxsus ranglar kodi `#c9a84c` kabi Mizan brendiga oltin rangda moslashtirilgan).
- **Icons**: Lucide React.
- **Holat boshqaruvi (State)**: React Context API (`useAppContext` orqali Global State, Tema va Tillar).

**Backend (Full-stack rejim):**
- **Server**: Node.js & Express.js (`server.ts` orqali).
- **AI Model**: Google Gemini 3.5 AI (rasmiy `@google/genai` SDK orqali Server-side ulanish).
- **Ma'lumotlar Baza**: 
  - Sessiyalar va Pishgan hisobotlar server hotirasida saqlanadi.
  - Qonunchilik ma'lumotlari: Vektor bazasi abstraksiyasi `db/laws.ts` (Cosine Similarity abstraksiyasiga asoslangan keyword-search mexanizmlari qilingan).
- **Build tizimi**: Esbuild (TypeScript backend'ni yig'ish u-n) va Vite (SPA).

---

## 📂 Kod Arxitekturasi va Papkalar Strukturasi

```text
/
├── server.ts               # Backend entry point - Express server va API marshrutlar (/api/chat, /api/report).
├── src/                    # Frontend yadro fayllari
│   ├── App.tsx             # Asosiy markaziy komponent va Sahifalar routerlanishi.
│   ├── main.tsx            # React DOM ulanish nuqtasi.
│   ├── index.css           # Global Tailwind uslublari va maxsus Tematika sozlamalari.
│   ├── components/         # Mantiqi ajratilgan UI qismlari:
│   │   ├── layout/         # Navbar va Footer qismlari.
│   │   ├── ui/             # Card, Button kabi tayyorlangan UI elementlar.
│   │   └── chat/           # Chat sahifasining elementlari (KnowledgeBase, Xabar panellari).
│   ├── pages/              # Dasturning asosiy yo'nalish sahifalari:
│   │   ├── LandingPage.tsx # Mizan qanday ishlashini namoyish qiluvchi vitrina.
│   │   ├── ChatPage.tsx    # Huquqiy Chat oynasi.
│   │   ├── ReportPage.tsx  # Tahlil natijalari va Dinamik Hisobotni ko'rsatish sahifasi.
│   │   ├── PricingPage.tsx # Tariflar, reja tanlash, obunalar sahifasi.
│   │   ├── LoginPage.tsx   # Tizimga kirish avtorizatsiya ekrani.
│   │   └── MediatorPage.tsx# Eng sara yuridik mutaxassislar / mediatorlar ruyxati vitrinasi.
│   ├── hooks/              # Shaxsiy React Hook'lar jildi (useAppContext, useAuth).
│   ├── services/           # Backend (Express API) bilan gaplashuvchi call'lar (api.ts).
│   └── db/                 # Qonuniyat va RAG bazasi (laws.ts, vector store algoritimlari).
├── .env.example            # Muhit o'zgaruvchilari namunasi (GEMINI_API_KEY).
├── package.json            # NPM dependensiyalari va Build / Dev skriptlari.
└── vite.config.ts          # Vite frontend build konfiguratsiyasi.
```

---

## ⚙️ RAG (Retrieval-Augmented Generation) Mexanizmi Qanday Ishlaydi?
1. Foydalanuvchi Chat orqali yuridik nizosini yozib qoldiradi (masalan: *"Men katta firmaga dastur qilib berdim lekin pulimni oxirgacha bermayapti. Shartnoma bor"*).
2. Backend API bu matnni olinib `VectorStore` yordamida skanerdan o'tkazadi.
3. Chatda yozilgan yozuvdagi kalit iboralar olinib, Mizan'ning `db/laws.ts` lokal qonun xujjatlaridan eng moskeladigan (masalan FP: Shartnoma Majburiyatlari) qismlari referans sifatida terib olinadi.
4. Eng mos kelgan RAG moddalar, foydalanuvchining hisobot generatsiyasi so'roviga "System Prompt" ichidagi QONUN MODDALARI sifatia qo'shilib Gemini LLM modeliga tahlilga yuboriladi.
5. Shuning natijasida LLM osmondan olib emas, **AYNAN O'zbekiston Qonunchiligidagi** tegishli moddalar haqiqati ostida tahlilnoma va yutish strategiyasini JSON javob sifatida chiqaradi.

---

## 🚀 Ishga Tushirish (Local Setup)

**1. Muhit o'zgaruvchilari**
Loyihaning ildiz papkasida `.env` qiling. `.env.example` ichidagini nusxalang va Gemini kalitingizni bering:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**2. Bog'liqliklarni o'rnatish**
```sh
npm install
```

**3. Test (Development) rejimida ishga tushirish**
```sh
npm run dev
```
(Ushbu skript TypeScript compiler yordamida tezkor Vite Serverni va Express Backend'ni bitta port 3000da ko'taradi).

**4. Dasturni prodyuksiyaga yig'ish (Build)**
```sh
npm run build
npm run start
```
(Esbuild orqali express qismi bundle qilinadi, Vite esa frontni statik dist qilib tayyorlaydi).

---

> **Diskleymer:** Mizan AI professional sud'ya yoki inson-advokat emas. Platforma taqdim etadigan modellar sudgacha nizo haqida ma'lumot qidiruvchilarga jarayonlarning moddiy va vaqt xavflarini oldindan ko'rish va tinchroq kelishuvga (Mediatsiyaga) moyil qilish u-n yaratilgan ehtimolli konsalting asbobidir.