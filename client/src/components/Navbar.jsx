import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Lightbulb,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Menu,
  X,
  BarChart
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-lg shadow-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">
                IdeaFlow
              </h1>
              <p className="text-primary-100 text-[10px] font-medium tracking-wider uppercase hidden sm:block">
                Automation Ideas
              </p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 ml-8 flex-1">
            <Link 
              to="/" 
              className="text-primary-100 hover:text-white font-medium text-sm transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/ideas" 
              className="text-primary-100 hover:text-white font-medium text-sm transition-colors"
            >
              Ideas
            </Link>
            <Link 
              to="/motive" 
              className="text-primary-100 hover:text-white font-medium text-sm transition-colors"
            >
              Motive
            </Link>
            <Link 
              to="/approach" 
              className="text-primary-100 hover:text-white font-medium text-sm transition-colors"
            >
              Approach
            </Link>
            <Link 
              to="/insights" 
              className="text-primary-100 hover:text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <BarChart className="w-4 h-4" />
              Insights
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden sm:flex items-center gap-4">
            {user?.role === 'admin' && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </span>
            )}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                           text-white px-4 py-2 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{user?.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showProfile ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl
                               border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-primary-50 to-orange-50 border-b border-gray-100">
                      <p className="font-semibold text-slate-800">
                        {user?.name}
                      </p>
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

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobile(!showMobile)}
            className="sm:hidden text-white p-2"
          >
            {showMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-primary-700 border-t border-primary-600 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-primary-200 text-sm">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10
                           rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
