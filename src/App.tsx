import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SignIn } from "./components/SignIn";
import { Dashboard } from "./components/Dashboard";
import { AppProvider } from "./lib/store";
import { UserProvider } from "./contexts/UserContext";
import { Toaster } from "sonner";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'dashboard'>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'lab-assistant' | 'student' | null>(null);

  const handleSignIn = (role: 'admin' | 'teacher' | 'lab-assistant' | 'student') => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setUserRole(null);
    setCurrentView('landing');
  };

  const handleGetStarted = () => {
    setCurrentView('signin');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  if (currentView === 'signin') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <SignIn onSignIn={handleSignIn} onBack={handleBackToHome} />
      </>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <UserProvider>
        <AppProvider>
          <Toaster position="top-right" richColors />
          <Dashboard userRole={userRole} onSignOut={handleSignOut} />
        </AppProvider>
      </UserProvider>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" richColors />
      <Header onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              © {new Date().getFullYear()} Wayamba University of Sri Lanka
            </p>
            <p className="text-xs text-gray-500">
              Labventory Management System • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}