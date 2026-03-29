import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from "lucide-react";
import StatusBadge from './StatusBadge';
import {
  ArrowRight,
  User,
  Tag,
  IndianRupee,
  Clock,
  AlertCircle
} from 'lucide-react';

const categoryColors = {
  Logistics: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-l-indigo-500' },
  HR: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-l-pink-500' },
  IT: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-l-cyan-500' },
  Operations: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-l-violet-500' },
  Finance: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-500' },
  Other: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-l-gray-400' }
};

export default function IdeaCard({ idea, index }) {
  const navigate = useNavigate();
  const catConfig = categoryColors[idea.category] || categoryColors.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/ideas/${idea._id}`)}
      className={`premium-card overflow-hidden
                  cursor-pointer hover:shadow-xl hover:border-white/80 transition-all duration-300
                  border-l-4 ${catConfig.border} group`}
    >
      {/* Image Thumbnail */}
      {idea.images && idea.images.length > 0 && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={idea.images[0]}
            alt={idea.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {idea.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
              +{idea.images.length - 1} more
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Header: Category + Status */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg
                ${catConfig.bg} ${catConfig.text}`}
          >
            <Tag className="w-3 h-3" />
            {idea.category}
          </span>
          <span
            className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${idea.priority === 'High'
                ? 'bg-red-100 text-red-600'
                : idea.priority === 'Medium'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
          >
            {idea.priority}
          </span>
        </div>
        <StatusBadge status={idea.status} />

        {/* Title & Problem Discovery Symbol */}
        <div className="flex items-start gap-3 mb-2">
          <Search className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
            {idea.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {idea.description}
        </p>

        {/* Impact Info */}
        {idea.impact && (
          <div className="flex items-center gap-4 mb-4">
            {idea.impact.timeSaved && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-primary-500" />
                <span>{idea.impact.timeSaved}</span>
              </div>
            )}
            {idea.impact.costSaved && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                <span>{idea.impact.costSaved}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-primary-600" />
            </div>
            <span className="text-xs text-slate-400">
              {idea.submittedBy?.name || 'Unknown'}
            </span>
          </div>
          <motion.span
            className="flex items-center gap-1 text-xs font-medium text-primary-500 opacity-0
                       group-hover:opacity-100 transition-opacity duration-200"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
