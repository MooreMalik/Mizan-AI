import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Scale, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

interface LoginPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialParams?: any;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialParams }) => {
  const { login, register } = useAuth();
  const { t, language } = useAppContext();
  
  const [isRegister, setIsRegister] = useState<boolean>(initialParams?.mode === 'register');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [tariff, setTariff] = useState<'FREE' | 'PLUS' | 'PRO' | 'MAX'>(initialParams?.tariff || 'PLUS');
  const [role, setRole] = useState<'client' | 'mediator'>('client');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorString(null);
    setLoading(true);

    if (!email || !password || (isRegister && !fullName)) {
      setErrorString(language === 'uz' ? 'Barcha maydonlarni majburiy ravishda to\'ldiring!' : 'Пожалуйста, заполните все поля!');
      setLoading(false);
      return;
    }

    try {
      let authUser;
      if (isRegister) {
        authUser = await register(fullName, email, password, tariff, role);
      } else {
        authUser = await login(email, password);
      }
      
      onNavigate(authUser?.role === 'mediator' ? 'mediator' : 'chat');
    } catch (err: any) {
      setErrorString(err.message || (language === 'uz' ? 'Avtorizatsiya jarayonida xatolik!' : 'Ошибка авторизации!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login_page" className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Logo and Greeting header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 items-center justify-center mx-auto shadow-lg shadow-[#c9a84c]/5">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-extrabold tracking-tight col_white">
            {isRegister ? t('reg_welcome') : t('login_welcome')}
          </h1>
          <p className="text-xs text-gray-400">
            {isRegister ? t('reg_subtitle') : t('login_subtitle')}
          </p>
        </div>

        {/* Action Form Block */}
        <Card id="login_form_card" accented className="p-8 bg_card">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show local validation errors */}
            {errorString && (
              <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/50 text-red-500 text-xs text-center font-medium">
                {errorString}
              </div>
            )}

            {isRegister && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">{t('label_role')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        role === 'client'
                          ? 'bg-[#c9a84c]/10 border-[#c9a84c] text-[#c9a84c]'
                          : 'border-gray-800 bg-transparent text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {t('role_client')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('mediator');
                        setTariff('MAX');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        role === 'mediator'
                          ? 'bg-[#c9a84c]/10 border-[#c9a84c] text-[#c9a84c]'
                          : 'border-gray-800 bg-transparent text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {t('role_mediator')}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">{t('label_fullname')}</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                    <input
                      id="input_fullname"
                      type="text"
                      required
                      placeholder={role === 'mediator' ? (language === 'uz' ? "Ism va Familiya (Mediator)" : "Имя и Фамилия (Медиатор)") : (language === 'uz' ? "Ism va Familiya" : "Имя и Фамилия")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 bg-[#101726]/60 text-white placeholder-gray-500 text-sm focus:border-[#c9a84c] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">{t('label_email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                <input
                  id="input_email"
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 bg-[#101726]/60 text-white placeholder-gray-500 text-sm focus:border-[#c9a84c] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">{t('label_password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                <input
                  id="input_password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 bg-[#101726]/60 text-white placeholder-gray-500 text-sm focus:border-[#c9a84c] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Hidden field for register mode to customize tier selection */}
            {isRegister && role === 'client' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">{t('label_tariff')}</label>
                <select
                  id="select_tariff"
                  value={tariff}
                  onChange={(e: any) => setTariff(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-800 bg-[#101726]/60 text-white text-sm focus:border-[#c9a84c] focus:outline-none transition-all"
                >
                  <option value="PLUS">PLUS Tarifa (150,000 UZS /oy)</option>
                  <option value="PRO">PRO Tarifa (490,000 UZS /oy)</option>
                  <option value="MAX">MAX Tarifa (1,500,000 UZS /oy)</option>
                </select>
              </div>
            )}

            <div className="pt-3">
              <Button
                id="login_submit_btn"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? (language === 'uz' ? 'Tekshirilmoqda...' : 'Проверка...') : isRegister ? t('btn_signup') : t('btn_signin')}
              </Button>
            </div>

          </form>

          {/* Toggle register/login links */}
          <div className="mt-6 text-center text-xs">
            {isRegister ? (
              <p className="text-gray-400">
                {t('have_acc')}{' '}
                <button
                  id="toggle_to_login"
                  onClick={() => setIsRegister(false)}
                  className="text-[#c9a84c] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  {t('go_login')}
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                {t('no_acc')}{' '}
                <button
                  id="toggle_to_register"
                  onClick={() => setIsRegister(true)}
                  className="text-[#c9a84c] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  {t('go_reg')}
                </button>
              </p>
            )}
          </div>

        </Card>

        {/* Security badge note */}
        <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-[#c9a84c]" />
          <span>{language === 'uz' ? 'Shifrlangan va xavfsiz translyatsiya' : 'Шифрованная и безопасная передача данных'}</span>
        </div>

      </div>
    </div>
  );
};
