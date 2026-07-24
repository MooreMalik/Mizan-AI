import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Scale, ShieldCheck, Search, Clock, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../hooks/useAppContext';

interface LandingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useAppContext();

  const handleCTA = () => {
    if (user) {
      onNavigate('chat');
    } else {
      onNavigate('login');
    }
  };

  return (
    <div id="landing_page" className="flex-1 bg-[#0a0a1a] text-[#e0e0e0] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-[#16213e]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* 🏛️ Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/25 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Top badge */}
          <div className="inline-flex items-center space-x-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3 py-1.5 rounded-full text-xs text-[#c9a84c] font-medium tracking-wide">
            <ShieldCheck className="h-4 w-4" />
            <span>{t('hero_badge')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold tracking-tight leading-tight">
            {t('hero_title_1')} <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-[#c9a84c] bg-clip-text text-transparent">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              id="hero_btn_start"
              onClick={handleCTA}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 shadow-lg shadow-[#c9a84c]/20"
            >
              {t('hero_start_cta')}
            </Button>
            <Button
              id="hero_btn_pricing"
              onClick={() => onNavigate('pricing')}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4"
            >
              {t('hero_pricing_cta')}
            </Button>
          </div>

          {/* Core summary specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 text-center max-w-3xl mx-auto border-t border-white/5 font-serif">
            <div>
              <p className="text-2xl sm:text-3xl text-white font-bold">100%</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t('stat_privacy')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl text-[#c9a84c] font-bold">X5</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t('stat_saving')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl text-white font-bold">RAG</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t('stat_database')}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl text-[#c9a84c] font-bold">30 kun</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t('stat_archive')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ⚖️ How It Works (Qadamlar) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] font-bold">{t('steps_badge')}</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">{t('steps_title')}</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            {t('steps_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card id="step_card_1" hoverable className="space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] font-serif font-bold flex items-center justify-center border border-[#c9a84c]/20">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-white">{t('step1_title')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('step1_desc')}
            </p>
          </Card>

          <Card id="step_card_2" hoverable className="space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] font-serif font-bold flex items-center justify-center border border-[#c9a84c]/20">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-white">{t('step2_title')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('step2_desc')}
            </p>
          </Card>

          <Card id="step_card_3" hoverable className="space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] font-serif font-bold flex items-center justify-center border border-[#c9a84c]/20">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-white">{t('step3_title')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('step3_desc')}
            </p>
          </Card>

          <Card id="step_card_4" hoverable className="space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] font-serif font-bold flex items-center justify-center border border-[#c9a84c]/20">
              04
            </div>
            <h3 className="text-lg font-serif font-bold text-white">{t('step4_title')}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('step4_desc')}
            </p>
          </Card>
        </div>
      </section>

      {/* ⚡ Features Section */}
      <section className="bg-[#16213e]/80 py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] font-bold">{t('why_badge')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {t('why_title')}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('why_desc')}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#4caf50]/10 p-1.5 rounded text-[#4caf50] mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t('why1_title')}</h4>
                  <p className="text-xs text-gray-400">{t('why1_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#c9a84c]/10 p-1.5 rounded text-[#c9a84c] mt-0.5">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t('why2_title')}</h4>
                  <p className="text-xs text-gray-400">{t('why2_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/10 p-1.5 rounded text-blue-400 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t('why3_title')}</h4>
                  <p className="text-xs text-gray-400">{t('why3_desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive scales graphic visual placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-[#16213e] to-[#101726] border border-gray-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-black/40">
              <div className="border border-gray-800/80 bg-gray-950/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] border border-[#c9a84c]/20">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-serif text-white font-bold">{t('calc_title')}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{t('calc_sub')}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-green-950/20 text-green-400 border border-green-800/30 rounded font-mono uppercase tracking-wider">{t('calc_status')}</span>
              </div>

              <div className="space-y-4 my-6">
                <div className="flex items-center justify-between text-xs font-serif border-b border-gray-800 pb-2">
                  <span className="text-gray-400">{t('calc_type')}</span>
                  <span className="text-white font-medium">{t('calc_type_val')}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-serif border-b border-gray-800 pb-2">
                  <span className="text-gray-400">{t('calc_duty')}</span>
                  <span className="text-[#c9a84c] font-bold">{t('calc_duty_val')}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-serif border-b border-gray-800 pb-2">
                  <span className="text-gray-400">{t('calc_win')}</span>
                  <span className="text-green-400 font-bold">{t('calc_win_val')}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="text-gray-400">{t('calc_alt')}</span>
                  <span className="text-blue-400 font-bold">{t('calc_alt_val')}</span>
                </div>
              </div>

              <Button
                id="landing_scales_start_cta"
                onClick={handleCTA}
                variant="accent"
                size="sm"
                fullWidth
              >
                {t('calc_cta')}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 💼 Alternative mediators endorsement CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <Users className="h-12 w-12 text-[#c9a84c] mx-auto bg-[#c9a84c]/5 p-2 rounded-2xl border border-[#c9a84c]/20" />
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{t('partner_title')}</h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
          {t('partner_desc')}
        </p>
        <div className="pt-2">
          <Button
            id="landing_collaborate_btn"
            onClick={() => onNavigate('pricing')}
            variant="secondary"
            size="md"
          >
            {t('partner_cta')}
          </Button>
        </div>
      </section>

    </div>
  );
};
