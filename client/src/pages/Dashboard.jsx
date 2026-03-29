import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const sections = [
    {
      title: 'Our Challenges',
      subtitle: 'Identify & Solve',
      description: 'Find repetitive manual tasks and submit automation ideas that solve real business problems.',
      icon: Lightbulb,
      symbol: '?',
      path: '/ideas',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50/50',
    },
    {
      title: 'The Vision',
      subtitle: 'Why we automate',
      description: 'Explore our core motive: maximizing human potential by minimizing routine data entry.',
      icon: Target,
      symbol: '!',
      path: '/motive',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50/50',
    },
    {
      title: 'The Process',
      subtitle: 'How it works',
      description: 'See the journey from a simple suggestion to a fully implemented automation solution.',
      icon: Navigation,
      symbol: '→',
      path: '/approach',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-800"
        >
          Welcome, {user?.name?.split(' ')[0] || 'User'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-2 text-lg"
        >
          Select a section to explore IdeaFlow.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} to={section.path} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="premium-card p-10 h-full flex flex-col items-center text-center group"
              >
                {/* Decorative background symbol related to problem statement */}
                <span className="absolute -bottom-6 -right-4 text-9xl font-black opacity-[0.03] select-none group-hover:opacity-[0.07] transition-opacity duration-500">
                  {section.symbol}
                </span>

                <div className={`w-24 h-24 glass-icon mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <div className={`absolute inset-0 ${section.bgColor} opacity-60 backdrop-blur-sm`}></div>
                  <Icon className={`w-10 h-10 ${section.color} relative z-10`} />
                </div>
                
                <span className={`text-xs font-bold uppercase tracking-widest ${section.color} mb-3`}>
                  {section.subtitle}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mb-4">{section.title}</h2>
                <p className="text-slate-500 leading-relaxed text-base">
                  {section.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-gray-100/50 w-full flex justify-center">
                  <span className={`flex items-center gap-2 text-sm font-bold ${section.color} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                    Explore Now
                    <Navigation className="w-4 h-4 rotate-90" />
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
