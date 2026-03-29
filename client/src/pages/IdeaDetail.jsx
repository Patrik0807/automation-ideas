import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/ideas';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  Image,
  IndianRupee,
  ShieldAlert,
  Tag,
  CalendarDays,
  Trash2,
  TrendingUp,
  ChevronDown,
  Send,
  FileText,
  User,
  Edit
} from 'lucide-react';
import IdeaForm from '../components/IdeaForm';

const allStatuses = [
  'Submitted',
  'Under Review',
  'Approved',
  'In Progress',
  'Implemented',
  'Rejected'
];

export default function IdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
// Add this to track existing + new images
const [previews, setPreviews] = useState([]); 
const [newFiles, setNewFiles] = useState([]); // only newly uploaded files
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
  if (idea?.images) {
    setPreviews(idea.images); // populate previews with existing DB URLs
  }
}, [idea]);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      const { data } = await API.getIdea(id);
      setIdea(data);
    } catch (error) {
      toast.error('Failed to load idea');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }
    setUpdating(true);
    try {
      const { data } = await API.updateStatus(id, {
        status: newStatus,
        note: statusNote
      });
      setIdea(data);
      setShowStatusUpdate(false);
      setNewStatus('');
      setStatusNote('');
      toast.success(`Status updated to "${newStatus}"`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.deleteIdea(id);
      toast.success('Idea deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete idea');
    } finally {
      setDeleting(false);
    }
  };

  // Progress bar percentage
  const getProgress = () => {
    const statusOrder = [
      'Submitted',
      'Under Review',
      'Approved',
      'In Progress',
      'Implemented'
    ];
    const idx = statusOrder.indexOf(idea?.status);
    if (idea?.status === 'Rejected') return 100;
    if (idx === -1) return 0;
    return ((idx + 1) / statusOrder.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const isAdmin = user?.role === 'admin';
  const isOwner = user?._id === idea.submittedBy?._id;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  {idea.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={idea.status} size="lg" />
                  <span className="text-primary-100 text-sm flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {idea.category}
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider
                      ${
                        idea.priority === 'High'
                          ? 'bg-red-500/20 text-red-100 border border-red-400/30'
                          : idea.priority === 'Medium'
                          ? 'bg-orange-500/20 text-orange-100 border border-orange-400/30'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                  >
                    {idea.priority} Priority
                  </span>

                  {/* Priority Toggle for Admin/Owner */}
                  {(isAdmin || isOwner) && (
                    <div className="flex gap-1 ml-2">
                      {['High', 'Medium', 'Low'].map((p) => (
                        <button
                          key={p}
                          onClick={async () => {
                            if (p === idea.priority) return;
                            try {
                              const { data } = await API.updateIdea(id, { priority: p });
                              setIdea(data);
                              toast.success(`Priority changed to ${p}`);
                            } catch (e) {
                              toast.error('Failed to change priority');
                            }
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all
                            ${
                              idea.priority === p
                                ? p === 'High' ? 'bg-red-500 text-white' : p === 'Medium' ? 'bg-orange-500 text-white' : 'bg-slate-500 text-white'
                                : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-primary-100 text-sm flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(idea.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {(isAdmin || isOwner) && (
                  <>
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-blue-500/90 text-white
                                 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Idea
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-red-500/90 text-white
                                 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                    className="flex items-center gap-2 bg-white text-primary-600 font-bold
                               px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Update Status
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showStatusUpdate ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-primary-200 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  idea.status === 'Rejected'
                    ? 'bg-red-400'
                    : 'bg-white'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        {/* Status Update Panel */}
        <AnimatePresence>
          {showStatusUpdate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Update Idea Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="select-field"
                    >
                      <option value="">Select status</option>
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Note (optional)
                    </label>
                    <input
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this update"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowStatusUpdate(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="btn-primary flex items-center gap-2"
                  >
                    {updating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Update Status
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
            </motion.div>

            {/* Attached Images */}
            {idea.images && idea.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary-500" />
                  Attached Images
                  <span className="text-sm font-normal text-slate-400">
                    ({idea.images.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {idea.images.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-video rounded-xl overflow-hidden border border-gray-200
                                 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Impact */}
            {idea.impact && (idea.impact.timeSaved || idea.impact.costSaved || idea.impact.notes) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Expected Impact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {idea.impact.timeSaved && (
                    <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">
                          Time Saved
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">
                        {idea.impact.timeSaved}
                      </p>
                    </div>
                  )}
                  {idea.impact.costSaved && (
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">
                          Cost Saved
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">
                        {idea.impact.costSaved}
                      </p>
                    </div>
                  )}
                </div>
                {idea.impact.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-slate-600">{idea.impact.notes}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Submitted By */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                Submitted By
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {idea.submittedBy?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {idea.submittedBy?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {idea.submittedBy?.email}
                  </p>
                  {idea.submittedBy?.department && (
                    <p className="text-xs text-primary-600 font-medium mt-0.5">
                      {idea.submittedBy.department}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column — Timeline */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Status Timeline
              </h2>
              <Timeline statusHistory={idea.statusHistory} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Delete Idea?</h3>
                  <p className="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white font-semibold px-6 py-3 rounded-xl
                             hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <IdeaForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        idea={idea}
        existingImages={idea.images} 
        onCreated={(updated) => {
          setIdea(updated);
          setShowEditForm(false);
        }}
      />
    </div>
  );
}
