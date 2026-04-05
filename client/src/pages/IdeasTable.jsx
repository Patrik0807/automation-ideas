import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Search,
  Filter,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Papa from 'papaparse';
import { format } from 'date-fns';

const STATUS_COLORS = {
  'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
  'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
  'Implemented': 'bg-slate-50 text-slate-500 border-slate-200',
  'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
};

const SORT_OPTIONS = [
  { label: 'Latest Submission', key: 'createdAt', direction: 'desc', icon: Clock },
  { label: 'Earliest Submission', key: 'createdAt', direction: 'asc', icon: Calendar },
  { label: 'Highest Priority', key: 'priority', direction: 'desc', icon: TrendingUp },
  { label: 'Lowest Priority', key: 'priority', direction: 'asc', icon: AlertCircle },
  { label: 'Status-wise', key: 'status', direction: 'asc', icon: Filter },
];

export default function IdeasTable() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(SORT_OPTIONS[0]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/ideas');
      setIdeas(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ideas. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedAndFilteredIdeas = useMemo(() => {
    let filtered = ideas.filter(idea =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.customId && idea.customId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'priority') {
        const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityMap[a.priority] || 0;
        bValue = priorityMap[b.priority] || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [ideas, searchTerm, sortConfig]);

  const exportToCSV = () => {
    // 1. Prepare clean data summary for export
    const exportData = sortedAndFilteredIdeas.map(i => ({
      "ID": i.customId || i._id.slice(-8).toUpperCase(),
      "Title": i.title,
      "Status": i.status,
      "Date": format(new Date(i.createdAt), 'yyyy-MM-dd'),
      "Impact": i.impact
        ? `${i.impact.timeSaved || 'N/A'} | ${i.impact.costSaved || 'N/A'}`
        : "N/A"
    }));

    // 2. Generate CSV string with proper quoting using PapaParse
    const csv = Papa.unparse(exportData);

    // 3. Create Blob with UTF-8 BOM (essential for Excel to recognize it correctly)
    const blob = new Blob(["\ufeff", csv], { type: 'text/csv;charset=utf-8;' });

    // 4. Force download using standard browser anchor method
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `automation_ideas_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-wide">Gathering industrial insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-primary-600 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Enterprise Registry</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
            Ideas <span className="text-primary-600">Inventory</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            A comprehensive overview of all submitted automation proposals across the TAL ecosystem.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={ideas.length === 0}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl
                     font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
        >
          <Download className="w-5 h-5" />
          Export to CSV
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>

        <div className="md:col-span-4 relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-slate-700 hover:border-primary-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <sortConfig.icon className="w-4 h-4 text-primary-500" />
              <span>{sortConfig.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setSortConfig(opt);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-bold text-left transition-colors
                        ${sortConfig.label === opt.label ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <opt.icon className={`w-4 h-4 ${sortConfig.label === opt.label ? 'text-primary-600' : 'text-slate-400'}`} />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Custom ID</th>
                <th className="px-8 py-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Idea Title</th>
                <th className="px-8 py-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Submitted Date</th>
                <th className="px-8 py-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Impact</th>
                <th className="px-8 py-6 text-right text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedAndFilteredIdeas.map((idea, idx) => (
                <tr
                  key={idea._id}
                  className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'} hover:bg-primary-50/30`}
                >
                  <td className="px-8 py-6">
                    <span className="font-mono text-sm font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                      {idea.customId || '—'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {idea.title}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[idea.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {idea.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 font-bold text-sm">
                        {format(new Date(idea.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {format(new Date(idea.createdAt), 'hh:mm a')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {idea.impact && (idea.impact.timeSaved || idea.impact.costSaved) ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {idea.impact.timeSaved || '0h'}
                        </span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          ₹ {idea.impact.costSaved || '0'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">No direct impact</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a
                      href={`/ideas/${idea._id}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-400 
                                 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedAndFilteredIdeas.length === 0 && (
            <div className="p-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Ideas Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
                Try adjusting your search terms or wait for new submissions.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        <span>TAL Automation Hub v2.0</span>
        <span>Confidential Inventory &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
