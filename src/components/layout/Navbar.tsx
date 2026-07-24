import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../hooks/useAppContext';
import { Scale, LogOut, User, DollarSign, MessageSquare, Briefcase, Globe, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const { language, theme, setLanguage, setTheme, t } = useAppContext();

  const getTariffBadgeColor = (u: any) => {
    if (u?.role === 'mediator') {
      return 'border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10';
    }
    switch (u?.tariff) {
      case 'MAX': return 'border-red-500/50 text-red-500 bg-red-950/20';
      case 'PRO': return 'border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10';
      case 'PLUS': return 'border-blue-500/50 text-[#c9a84c] bg-blue-950/20';
      default: return 'border-gray-500/50 text-gray-500 bg-gray-950/20';
    }
  };

  return (
    <nav id="mizan_navbar" className="sticky top-0 z-50 bg-[#0a0a1a]/70 backdrop-blur-md border-b border-white/5 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Emblem */}
        <button
          id="nav_btn_logo"
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-2 text-left group"
        >
          <div className="bg-[#c9a84c]/10 p-2 rounded-lg border border-[#c9a84c]/20 group-hover:bg-[#c9a84c]/20 transition-all duration-300">
            <Scale className="h-6 w-6 text-[#c9a84c]" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-wider text-[#c9a84c] font-semibold group-hover:brightness-110 transition-colors duration-300">
              MIZAN
            </span>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono leading-none">{t('nav_tagline')}</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            id="nav_btn_why"
            onClick={() => onNavigate('landing')}
            className={`text-xs sm:text-sm tracking-wide transition-colors ${currentPage === 'landing' ? 'text-[#c9a84c] font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            {t('nav_info')}
          </button>
          
          <button
            id="nav_btn_pricing"
            onClick={() => onNavigate('pricing')}
            className={`text-xs sm:text-sm tracking-wide transition-colors ${currentPage === 'pricing' ? 'text-[#c9a84c] font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            {t('nav_pricing')}
          </button>

          {user ? (
            <>
              {user.role === 'mediator' ? (
                <button
                  id="nav_btn_mediator"
                  onClick={() => onNavigate('mediator')}
                  className={`flex items-center space-x-1.5 text-xs sm:text-sm tracking-wide transition-colors ${currentPage === 'mediator' ? 'text-[#c9a84c] font-medium' : 'text-gray-300 hover:text-[#c9a84c]'}`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav_mediator_panel')}</span>
                </button>
              ) : (
                <button
                  id="nav_btn_chat"
                  onClick={() => onNavigate('chat')}
                  className={`flex items-center space-x-1.5 text-xs sm:text-sm tracking-wide transition-colors ${currentPage === 'chat' ? 'text-[#c9a84c] font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav_consultation')}</span>
                </button>
              )}

              <div className="flex items-center space-x-2 sm:space-x-3 bg-[#16213e] border border-white/5 py-1 px-2.5 sm:px-3 rounded-full">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-semibold text-white truncate max-w-[100px]">{user.fullName}</p>
                  <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-mono ${getTariffBadgeColor(user)}`}>
                    {user.role === 'mediator' ? 'MEDIATOR' : `${user.tariff} ${t('nav_tariff_suffix')}`}
                  </span>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center border border-[#c9a84c]/30 text-[#c9a84c] font-serif font-bold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                
                <button
                  id="nav_btn_logout"
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  title={t('nav_logout')}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                id="nav_btn_auth_login"
                onClick={() => onNavigate('login')}
                className="text-xs sm:text-sm border border-gray-700 hover:border-gray-500 py-1.5 px-2.5 sm:px-3 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
              >
                {t('nav_login')}
              </button>
              <button
                id="nav_btn_auth_register"
                onClick={() => onNavigate('login', { mode: 'register' })}
                className="text-xs sm:text-sm bg-gradient-to-r from-[#c9a84c] to-[#af9038] text-[#1a1a2e] font-semibold py-1.5 px-3 sm:px-4 rounded-lg hover:shadow-lg hover:shadow-[#c9a84c]/10 active:scale-95 transition-all duration-300"
              >
                {t('nav_register')}
              </button>
            </div>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 sm:p-2 bg-[#16213e] hover:bg-[#1f2d55] border border-white/5 rounded-lg text-[#c9a84c] transition duration-200"
            title="Mavzu"
          >
            {theme === 'dark' ? <Sun className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> : <Moon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />}
          </button>

          {/* Language Switcher Toggle */}
          <button
            onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
            className="flex items-center space-x-1 text-[10px] sm:text-xs font-mono uppercase bg-[#16213e] hover:bg-[#1f2d55] border border-white/5 py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-lg text-[#c9a84c] transition"
            title="Language / Til"
          >
            <Globe className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            <span>{language}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
