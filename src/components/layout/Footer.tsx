import React from 'react';
import { Scale, Shield, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="mizan_footer" className="bg-[#101726] border-t border-[#c9a84c]/10 text-gray-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-[#c9a84c]" />
            <span className="font-serif text-lg tracking-wider text-white font-semibold">MIZAN</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Mizan — sudga borishdan oldin sun'iy intellekt va RAG texnologiyasi yordamida O'zbekiston Respublikasi qonunchiligi asosida to'liq huquqiy tahlil taqdim etuvchi zamonaviy platforma.
          </p>
        </div>

        {/* Security & Confidentiality column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <Shield className="h-5 w-5 text-[#c9a84c]" />
            <span>Kiberxavfsizlik va Maxfiylik</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Biz barcha foydalanuvchi ma'lumotlarini server ichida shifrlangan holda saqlaymiz. AI tahlil so'rovlari va yuklangan fayllar mutlaqo shaxsiy hisoblanadi va 30 kundan so'ng tizimdan avtomatik ravishda butunlay o'chiriladi.
          </p>
        </div>

        {/* Legislation compliance details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <Landmark className="h-5 w-5 text-[#c9a84c]" />
            <span>Qonuniy Asos</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Qonuniy tahlillar O'zbekiston Respublikasining Fuqarolik Kodeksi, Fuqarolik Protsessual Kodeksi, Mediatsiya to'g'risidagi qonun hamda Davlat boji to'g'risidagi qonun stavkalari asosida amalga oshiriladi.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Mizan AI. Barcha huquqlar himoyalangan.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <span>O'zbekiston Respublikasi qonunchiligiga muvofiq</span>
          <span>•</span>
          <span>Maxfiylik kelishuvi</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <span>Esaltib o'tamiz: Mizan AI professional sud'ya yoki inson-advokat emas. Platforma taqdim etadigan modellar sudgacha nizo haqida ma'lumot qidiruvchilarga jarayonlarning moddiy va vaqt xavflarini oldindan ko'rish va tinchroq kelishuvga (Mediatsiyaga) moyil qilish uchun yaratilgan ehtimolli konsalting platformasidir.</span>
        <div className="flex space-x-4 mt-4 sm:mt-0">
        </div>
      </div>
    </footer>
  );
};
