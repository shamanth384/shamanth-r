import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp, Users, Database, PieChart as PieIcon, 
  BarChart3, Activity, Info, Mail, Linkedin, Github,
  ChevronDown, ArrowRight, CheckCircle2, AlertCircle,
  LayoutDashboard, ShieldAlert, Cpu, LogOut, User as UserIcon, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { useAuth } from './lib/AuthContext';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { AuthModal } from './lib/AuthModal';
import { BookingModal } from './lib/BookingModal';
import { MyBookingsModal } from './lib/MyBookingsModal';
import { NotificationProvider } from './lib/NotificationCenter';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import DataOverview from './pages/DataOverview';
import EDA from './pages/EDA';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import { AIAssistant } from './components/AIAssistant';

// --- Components ---

interface NavbarProps {
  onLogin: () => void;
  onBook: () => void;
  onMyBookings: () => void;
}

const Navbar = ({ onLogin, onBook, onMyBookings }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Data', href: '/data' },
    { name: 'EDA', href: '/eda' },
    { name: 'Insights', href: '/insights' },
    { name: 'Help', href: '/help' },
  ];

  const handleLogout = () => {
    signOut(auth);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled || location.pathname !== '/' ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm" : "bg-transparent text-white"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldAlert className={cn("w-8 h-8 transition-colors", isScrolled || location.pathname !== '/' ? "text-blue-600" : "text-white")} />
          <span className={cn("font-sans font-bold text-xl tracking-tight transition-colors", isScrolled || location.pathname !== '/' ? "text-slate-900" : "text-white")}>RiskPulse</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.href}
              className={({ isActive }) => cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                isActive ? "text-blue-600" : (isScrolled || location.pathname !== '/' ? "text-slate-600" : "text-slate-200")
              )}
            >
              {link.name}
            </NavLink>
          ))}
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                    "flex items-center gap-3 pl-4 border-l",
                    isScrolled || location.pathname !== '/' ? "border-slate-200" : "border-white/20"
                )}
              >
                <div className="text-right">
                  <div className={cn("text-sm font-bold leading-tight", isScrolled || location.pathname !== '/' ? "text-slate-900" : "text-white")}>{user.displayName || 'User'}</div>
                  <div className={cn("text-[10px]", isScrolled || location.pathname !== '/' ? "text-slate-500" : "text-white/60")}>Premium Analyst</div>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="p" className="w-8 h-8 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={() => { onMyBookings(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Calendar className="w-4 h-4" />
                          My Bookings
                        </button>
                        <button 
                          onClick={() => { onBook(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Book Consultation
                        </button>
                        <div className="border-t border-slate-50 my-1" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Sign In
            </button>
          )}
        </div>
        
        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
             <NavLink to="/contact" className="text-xs font-mono opacity-50">Contact</NavLink>
        </div>
      </div>
    </nav>
  );
};

// --- App Content ---
const AppContent = ({ onLogin, onBook, onMyBookings }: { onLogin: () => void, onBook: () => void, onMyBookings: () => void }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        onLogin={onLogin} 
        onBook={onBook} 
        onMyBookings={onMyBookings}
      />
      
      <main className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/data" element={<DataOverview />} />
              <Route path="/eda" element={<EDA />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <AIAssistant />

      {/* Global Footer (optional but good for contact) */}
      {location.pathname !== '/contact' && (
         <footer className="py-12 bg-white border-t border-slate-100 text-center">
            <Link to="/contact" className="text-sm font-bold text-blue-600 hover:underline">Get in touch with the lead analyst &rarr;</Link>
         </footer>
      )}
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const { user } = useAuth();

  const handleBookClick = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <Router>
      <NotificationProvider>
        <AppContent 
          onLogin={() => setIsAuthOpen(true)} 
          onBook={handleBookClick} 
          onMyBookings={() => setIsMyBookingsOpen(true)} 
        />
        
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <MyBookingsModal isOpen={isMyBookingsOpen} onClose={() => setIsMyBookingsOpen(false)} />
      </NotificationProvider>
    </Router>
  );
}
