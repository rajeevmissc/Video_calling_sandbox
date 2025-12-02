import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header'; 
import Footer from "./Footer";
import ProviderCallAlert from '../components/ProviderCallAlert/ProviderCallAlert';
import UpcomingSessionAlert from "../components/UpcomingSessionAlert";
import { useMemo } from 'react';

const Layout = () => {
  // Get user data from localStorage and memoize it
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (error) {
      console.error('Error parsing userData:', error);
      return {};
    }
  }, []);

  const isProvider = userData.role === 'provider';
  const isUser = userData.role === 'user'
  const providerId = userData.providerId;
  const now = new Date().toISOString();
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <Header />
      </header>

      {/* Main Content - Takes Full Space */}
      <div className="flex-1 mt-[60px]"> 
        <Outlet />
      </div>

      {/* Footer Always at Bottom */}
      <footer className="w-full shadow-md">
        <Footer />
      </footer>

      {/* Provider Call Alerts - Show only for providers with valid providerId */}
      {isProvider && providerId && (
        <ProviderCallAlert providerId={providerId} />
      )}
      {isProvider || isUser &&(
        <UpcomingSessionAlert isProvider={isProvider} currentDateTime={now}/>
      )}
    </div>
  );
};

export default Layout;