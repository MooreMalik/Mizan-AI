import { LawReference } from '../types';

export const UZBEK_LAWS: LawReference[] = [
  {
    id: "fk-228",
    code: "FK 228-modda",
    title: "Mulkni boshqa shaxsning g'ayriqonuniy egaligidan talab qilib olish (Vindikatsiya)",
    content: "Mulkdor o'z mulkini boshqa shaxsning g'ayriqonuniy egaligidan talab qilib olishga (vindikatsiya d'avosi qo'zg'atishga) haqli. Agar mol-mulk uni begonalashtirishga haqli bo'lmagan shaxsdan haq evaziga sotib olingan bo'lsa va sotib oluvchi buni bilmagan va bilishi lozim bo'lmagan bo'lsa (halol sotib oluvchi), mulkdor bu mol-mulkni undan talab qilib olishga haqli emas.",
    category: "Property"
  },
  {
    id: "fk-229",
    code: "FK 229-modda",
    title: "Mulkdor huquqlarining egalik qilishdan mahrum etish bilan bog'liq bo'lmagan buzilishlarini bartaraf etish (Negator)",
    content: "Mulkdor egalik qilishdan mahrum etish bilan bog'liq bo'lmagan har qanday huquqbuzarliklarni bartaraf etishni talab qilishi mumkin (negator da'vosi). Bu da'vo mulkdorning o'z mulkidan foydalanish va uni tasarruf etishdagi to'siqlarni bartaraf etishga qaratilgan.",
    category: "Property"
  },
  {
    id: "fk-382",
    code: "FK 382-modda",
    title: "Shartnomani o'zgartirish va bekor qilish asoslari",
    content: "Shartnoma taraflarning kelishuvi bilan o'zgartirilishi va bekor qilinishi mumkin. Taraflardan birining talabi bilan shartnoma sud tomonidan faqat ikkinchi taraf shartnomani jiddiy ravishda buzganda yoki qonun yoxud shartnomada nazarda tutilgan boshqa hollarda o'zgartirilishi yoki bekor qilinishi mumkin. Shartnomaning bir taraf tomonidan buzilishi ikkinchi tarafga u shartnoma tuzishda umid qilishga haqli bo'lgan narsadan ko'p darajada mahrum bo'ladigan qilib zarar yetkazishi shartnomani jiddiy ravishda buzish hisoblanadi.",
    category: "Contract"
  },
  {
    id: "fk-385",
    code: "FK 385-modda",
    title: "Shartnomani o'zgartirish va bekor qilish tartibi",
    content: "Shartnomani o'zgartirish yoki bekor qilish haqidagi kelishuv, agar qonun, shartnoma yoki ish muomalasi odatlaridan boshqa tartib kelib chiqmasa, shartnoma qanday shaklda tuzilgan bo'lsa, shunday shaklda amalga oshiriladi. Taraf shartnomani o'zgartirish yoki bekor qilish haqidagi taklifga ikkinchi tarafdan rad javobi olgandan keyingina yoki taklifda ko'rsatilgan yoxud qonunda yoki shartnomada belgilangan muddatda, bunday muddat bo'lmaganda esa — o'ttiz kunlik muddatda javob olmaganidan keyin shartnomani o'zgartirish yoki bekor qilish to'g'risidagi talabni sudga taqdim etishi mumkin.",
    category: "Contract"
  },
  {
    id: "fk-324",
    code: "FK 324-modda",
    title: "Majburiyatni buzganlik uchun qarzdorning zarar to'lash majburiyati",
    content: "Qarzdor majburiyatni bajarmaganligi yoki lozim darajada bajarmaganligi tufayli kreditorga yetkazilgan zararni to'lashi shart. Zarar deganda kreditorning buzilgan huquqini tiklash uchun qilgan yoki qilishi lozim bo'lgan xarajatlari, mol-mulkining yo'qotilishi yoki shikastlanishi (haqiqiy zarar), shuningdek qarzdor majburiyatni bajarganida kreditor odatdagi fuqarolik muomalasi sharoitida olishi mumkin bo'lgan, lekin ololmay qolgan daromadlari (boy berilgan foyda) tushuniladi.",
    category: "Contract"
  },
  {
    id: "fk-985",
    code: "FK 985-modda",
    title: "Zarar yetkazganlik uchun javobgarlikning umumiy asoslari",
    content: "Fuqaroning shaxsiga yoki mol-mulkiga yetkazilgan zarar, shuningdek yuridik shaxsga yetkazilgan zarar uni yetkazgan shaxs tomonidan to'liq hajmda qoplanishi lozim. Zarar yetkazgan shaxs, agar zarar o'z aybi bilan yetkazilmaganini isbotlasa, zararni to'lashdan ozod qilinadi. Qonunda zararni yetkazuvchining aybi bo'lmagan taqdirda ham zararni qoplash nazarda tutilishi mumkin.",
    category: "Other"
  },
  {
    id: "fpk-189",
    code: "FPK 189-modda",
    title: "Da'vo arizasining shakli va mazmuni",
    content: "Da'vo arizasi sudga yozma shaklda (yoki elektron shaklda) taqdim etiladi. Arizada tuman (shahar) sudining nomi, da'vogar va javobgarning ism-sharifi, yashash joyi, telefon raqamlari, da'voga asos bo'lgan holatlar, dalillar, da'vogarning talabi (da'vo bahosi), ilova qilinayotgan hujjatlar ro'yxati va davlat boji to'langanligi to'g'risidagi hujjat ko'rsatilishi lozim.",
    category: "Procedure"
  },
  {
    id: "fpk-191",
    code: "FPK 191-modda",
    title: "Da'vo arizasini ish yuritishga qabul qilish",
    content: "Sudya da'vo arizasi taqdim etilgan kundan e'tiboran besh kundan kechiktirmasdan uni ish yuritishga qabul qilish to'g'risidagi masalani yakka tartibda hal etadi va ajrim chiqaradi. Ajrim taraflarga yuboriladi va unda sudga tayyorgarlik choralari, majlis vaqti ko'rsatiladi.",
    category: "Procedure"
  },
  {
    id: "fpk-201",
    code: "FPK 201-modda",
    title: "Fuqarolik ishini ko'rib chiqish muddatlari",
    content: "Fuqarolik ishlari sudga tayyorlash tugatilgan kundan boshqacha tartibda belgilanmagan bo'lsa, bir oygacha bo'lgan muddatda sudda ko'rib chiqilishi va hal qilinishi lozim. Alohida murakkab ishlarni ko'rib chiqish muddati sud ajrimi bilan yana ikki oygacha uzaytirilishi mumkin.",
    category: "Procedure"
  },
  {
    id: "obj-21",
    code: "Davlat boji qonuni 5-modda",
    title: "Sudlarga murojaat qilishda davlat boji stavkalari",
    content: "Fuqarolik ishlari bo'yicha sudlarda mulkiy xarakterdagi da'vo arizalaridan — da'vo bahosining 4 foizi miqdorida (lekin bazaviy hisoblash miqdorining 1 baravaridan kam bo'lmagan miqdorda) davlat boji undiriladi. Nomulkiy xarakterdagi arizalardan — BHMning 2 baravari miqdorida boj undiriladi. Nikohni bekor qilish haqidagi da'volardan — BHMning 2 baravari miqdorida boj undiriladi.",
    category: "Tax"
  },
  {
    id: "med-4",
    code: "Mediatsiya qonuni 4-modda",
    title: "Mediatsiyaning asosiy prinsiplari",
    content: "Mediatsiyaning asosiy prinsiplari maxfiylik, ixtiyoriylik, taraflarning hamkorligi va teng huquqliligi, mediatorning mustaqilligi va xolisligidir. Mediatsiyada erishilgan kelishuv taraflar tomonidan ixtiyoriy ravishda bajariladi.",
    category: "Mediation"
  },
  {
    id: "med-15",
    code: "Mediatsiya qonuni 15-modda",
    title: "Mediatsiyani qo'llash tartibi va shartnomasi",
    content: "Mediatsiya sud tartibidan tashqari holatda ham, sud jarayoni davomida ham qo'llanilishi mumkin. Sud jarayonida mediatsiya kelishuvi tuzilsa, sud ish yuritishni to'xtatadi yoki da'voni ko'rmasdan qoldiradi, to'langan davlat bojining esa 50% gacha bo'lgan qismi qonunchilikka binoan qaytarilishi mumkin.",
    category: "Mediation"
  }
];

export function retrieveMatchingLaws(query: string): LawReference[] {
  const normQuery = query.toLowerCase();
  
  const scoreLaw = (law: LawReference) => {
    let score = 0;
    
    const codeWords = law.code.toLowerCase().split(' ');
    for (const w of codeWords) {
      if (normQuery.includes(w)) score += 10;
    }

    const titleWords = law.title.toLowerCase().split(/[ \-\(\)\,]+/);
    for (const w of titleWords) {
      if (w.length > 3 && normQuery.includes(w)) score += 5;
    }

    const contentText = law.content.toLowerCase();
    const keywords = [
      "mulk", "shartnoma", "buzil", "bekor", "zarar", "pul", "boj", "da'vo", "sud", "mediatsiya", "kelish", "kvartira", "uy", "er", "er-xotin", "ajrash", "qarzdor", "foiz", "aliment", "baho", "hujjat"
    ];
    for (const kw of keywords) {
      if (contentText.includes(kw) && normQuery.includes(kw)) {
        score += 3;
      }
    }

    return score;
  };

  const scored = UZBEK_LAWS.map(law => ({ law, score: scoreLaw(law) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return UZBEK_LAWS.slice(0, 3);
  }

  return scored.slice(0, 4).map(item => item.law);
}
