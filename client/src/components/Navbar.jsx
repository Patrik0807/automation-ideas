import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  User,
  ChevronDown,
  Shield,
  Menu,
  X,
  BarChart,
  Lightbulb,
  LayoutDashboard,
} from 'lucide-react';

/* ─── Toyota Logo SVG (inline, no external dep) ─────────────── */
function ToyotaLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="30" rx="48" ry="28" stroke="#EB0A1E" strokeWidth="5.5" fill="none" />
      <ellipse cx="50" cy="30" rx="20" ry="28" stroke="#EB0A1E" strokeWidth="5.5" fill="none" />
      <ellipse cx="50" cy="14" rx="30" ry="10" stroke="#EB0A1E" strokeWidth="5.5" fill="none" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/ideas',     label: 'Ideas',       icon: Lightbulb },
  { to: '/insights',  label: 'Insights',    icon: BarChart },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile,  setShowMobile]  = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 lg:h-28">

          {/* ── Logo ── */}
          <Link to="/ideas" className="flex items-center gap-4 group">
            <ToyotaLogo className="w-14 h-14 group-hover:opacity-90 transition-opacity" />
            <div className="leading-tight">
              <p className="text-slate-900 font-black text-xl tracking-tight leading-none mb-0.5">TOYOTA</p>
              <p className="text-primary-600 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase leading-none">
                Automated Logistics
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-3 ml-12 flex-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[17px] font-extrabold transition-all duration-150
                  ${isActive(to)
                    ? 'bg-primary-50 text-primary-600 border border-primary-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>

          {/* ── Desktop User Menu ── */}
          <div className="hidden sm:flex items-center gap-3">
            {user?.role === 'admin' && (
              <span className="flex items-center gap-1.5 bg-primary-50 border border-primary-100
                                text-primary-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </span>
            )}

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2.5 bg-white hover:bg-gray-50 border border-gray-200
                           text-slate-700 px-4 py-2.5 rounded-2xl transition-all duration-200"
              >
                <div className="w-9 h-9 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-bold text-[15px] text-slate-800 tracking-tight">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl
                               border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                      <p className="font-semibold text-slate-800">{user?.name}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                      <p className="text-xs text-primary-600 font-medium mt-1 capitalize">
                        {user?.role} • {user?.department}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600
                                   hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mobile Menu Button ── */}
          <button
            onClick={() => setShowMobile(!showMobile)}
            className="sm:hidden text-slate-500 hover:text-slate-900 p-2 transition-colors"
          >
            {showMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-white border-t border-gray-100 overflow-hidden shadow-md"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setShowMobile(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${isActive(to) ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-2 text-slate-700">
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50
                             rounded-xl transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
