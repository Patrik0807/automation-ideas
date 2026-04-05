import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lightbulb, Search } from 'lucide-react';
import API from '../api/ideas';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import IdeaCard from '../components/IdeaCard';
import IdeaForm from '../components/IdeaForm';

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const [ideasRes, statsRes] = await Promise.all([
        API.getIdeas(params),
        API.getStats()
      ]);
      setIdeas(ideasRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [fetchData]);

  const handleIdeaCreated = (newIdea) => {
    setIdeas((prev) => [newIdea, ...prev]);
    fetchData(); // refresh stats
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        {/* Subtle background abstract elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/20 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Idea Dashboard
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Track and manage automation ideas across the organization
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-500 text-white font-bold
                         px-6 py-3 rounded-xl shadow-lg shadow-primary-700/20
                         hover:bg-primary-600 hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Submit Idea
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10 pb-12">
        {/* Stats */}
        <div className="mb-6">
          <StatsBar 
            stats={stats} 
            onFilterSelect={(status) => setFilters(prev => ({ ...prev, status }))}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-slate-500 mt-4 font-medium">Loading ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              {filters.search || filters.category !== 'All' || filters.status !== 'All' ? (
                <Search className="w-8 h-8 text-primary-400" />
              ) : (
                <Lightbulb className="w-8 h-8 text-primary-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              {filters.search || filters.category !== 'All' || filters.status !== 'All'
                ? 'No ideas match your filters'
                : 'No ideas yet'}
            </h3>
            <p className="text-slate-500 text-sm">
              {filters.search || filters.category !== 'All' || filters.status !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Be the first to submit an automation idea!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea, index) => (
              <IdeaCard key={idea._id} idea={idea} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Idea Form Modal */}
      <IdeaForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onCreated={handleIdeaCreated}
      />
    </div>
  );
}
