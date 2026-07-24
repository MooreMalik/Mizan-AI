import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppContextProvider, useAppContext } from './hooks/useAppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import { ReportPage } from './pages/ReportPage';
import { PricingPage } from './pages/PricingPage';
import { MediatorPage } from './pages/MediatorPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useAppContext();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [navParams, setNavParams] = useState<any>(null);

  const handleNavigate = (page: string, params: any = null) => {
    setNavParams(params);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} initialParams={navParams} />;
      case 'chat':
        // Guard chat behind login; if not authenticated, redirect to login
        if (!user) {
          return <LoginPage onNavigate={handleNavigate} initialParams={{ mode: 'login' }} />;
        }
        return <ChatPage onNavigate={handleNavigate} />;
      case 'report':
        if (!user) {
          return <LoginPage onNavigate={handleNavigate} initialParams={{ mode: 'login' }} />;
        }
        return <ReportPage onNavigate={handleNavigate} initialParams={navParams} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'mediator':
        if (!user || user.role !== 'mediator') {
          return <LoginPage onNavigate={handleNavigate} initialParams={{ mode: 'login' }} />;
        }
        return <MediatorPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-[#c9a84c] selection:text-[#0a0a1a] font-sans relative overflow-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f3f4f6] text-[#1a1e29]' : 'bg-[#0a0a1a] text-[#e0e0e0]'
    }`}>
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {/* Dynamic Main Body Content */}
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppContextProvider>
  );
}
