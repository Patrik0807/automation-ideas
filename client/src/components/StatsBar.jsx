import { motion } from 'framer-motion';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  Rocket,
  TrendingUp,
  Hourglass
} from 'lucide-react';

const statCards = [
  {
    key: 'total',
    label: 'Total Ideas',
    icon: Lightbulb,
    gradient: 'from-primary-500 to-orange-400',
    bg: 'bg-primary-50'
  },
  {
    key: 'Pending',
    label: 'Pending',
    icon: Hourglass,
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50'
  },
  {
    key: 'Approved',
    label: 'Approved',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-green-400',
    bg: 'bg-emerald-50'
  },
  {
    key: 'In Progress',
    label: 'In Progress',
    icon: Clock,
    gradient: 'from-amber-500 to-yellow-400',
    bg: 'bg-amber-50'
  },
  {
    key: 'Implemented',
    label: 'Implemented',
    icon: Rocket,
    gradient: 'from-green-600 to-emerald-500',
    bg: 'bg-green-50'
  }
];

export default function StatsBar({ stats, onFilterSelect }) {
  const getCount = (key) => {
    if (key === 'total') return stats?.total || 0;
    const found = stats?.byStatus?.find((s) => s._id === key);
    return found?.count || 0;
  };

  const handleClick = (key) => {
    if (!onFilterSelect) return;
    if (key === 'total') {
      onFilterSelect('All');
    } else {
      onFilterSelect(key);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const count = getCount(card.key);

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => handleClick(card.key)}
            className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                       hover:shadow-md hover:border-gray-200 transition-all duration-300 group cursor-pointer active:scale-95"
          >
            {/* Background gradient accent */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient}
                          opacity-[0.07] rounded-full -translate-y-8 translate-x-8
                          group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-500`}
            />

            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                <motion.p
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-slate-800 mt-1"
                >
                  {count}
                </motion.p>
              </div>
              <div
                className={`${card.bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-5 h-5 bg-gradient-to-br ${card.gradient} bg-clip-text`}
                  style={{ color: card.gradient.includes('primary') ? '#F97316' :
                    card.gradient.includes('blue') ? '#3B82F6' :
                    card.gradient.includes('emerald') ? '#10B981' :
                    card.gradient.includes('amber') ? '#F59E0B' : '#16A34A' }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
