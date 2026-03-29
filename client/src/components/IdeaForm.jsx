import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Send, ImagePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/ideas';

const categories = ['Software', 'Controls', 'Electrical', 'Mechanical'];

export default function IdeaForm({ isOpen, onClose, onCreated, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    timeSaved: '',
    costSaved: '',
    impactNotes: ''
  });

  const [images, setImages] = useState([]); // For preview & display
  const [previews, setPreviews] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // New File uploads
  const [deletedImages, setDeletedImages] = useState([]); // Track deleted existing images
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form & images on modal open
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || '',
          description: initialData.description || '',
          category: initialData.category || '',
          priority: initialData.priority || 'Medium',
          timeSaved: initialData.impact?.timeSaved || '',
          costSaved: initialData.impact?.costSaved || '',
          impactNotes: initialData.impact?.notes || ''
        });

        const existingImages = initialData.images || [];
        setImages(existingImages);
        setPreviews(existingImages);
        setNewFiles([]);
        setDeletedImages([]);
      } else {
        setForm({
          title: '',
          description: '',
          category: '',
          priority: 'Medium',
          timeSaved: '',
          costSaved: '',
          impactNotes: ''
        });
        setImages([]);
        setPreviews([]);
        setNewFiles([]);
        setDeletedImages([]);
      }
    }
  }, [initialData, isOpen]);

  // Handle new image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    setNewFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove image (existing or new)
  const removeImage = (index) => {
    const removed = images[index];

    // If it's an existing image URL, mark for deletion
    if (initialData?.images?.includes(removed)) {
      setDeletedImages((prev) => [...prev, removed]);
    } else {
      // It's a new file, remove from newFiles
      setNewFiles((prev) =>
        prev.filter((f) => URL.createObjectURL(f) !== removed)
      );
      URL.revokeObjectURL(removed);
    }

    // Remove from images and previews
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('priority', form.priority);
      formData.append(
        'impact',
        JSON.stringify({
          timeSaved: form.timeSaved,
          costSaved: form.costSaved,
          notes: form.impactNotes
        })
      );

      // Append new file uploads
      newFiles.forEach((file) => formData.append('images', file));

      // Include deleted existing images
      formData.append('deletedImages', JSON.stringify(deletedImages));

      let responseData;
      if (initialData) {
        const res = await API.updateIdea(initialData._id, formData);
        responseData = res.data;
        toast.success('🎉 Idea updated successfully!');
      } else {
        const res = await API.createIdea(formData);
        responseData = res.data;
        toast.success('🎉 Idea submitted successfully!');
      }

      onCreated(responseData);

      // Reset form
      setForm({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        timeSaved: '',
        costSaved: '',
        impactNotes: ''
      });
      setImages([]);
      setPreviews((prev) => {
        prev.forEach(URL.revokeObjectURL);
        return [];
      });
      setNewFiles([]);
      setDeletedImages([]);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-t-3xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white
                           bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {initialData ? 'Edit Idea' : 'Submit New Idea'}
                  </h2>
                  <p className="text-primary-100 text-sm">
                    {initialData
                      ? 'Update details and add new attachments'
                      : 'Share your automation idea with the team'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Automated Invoice Processing"
                  className="input-field"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="select-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {['High', 'Medium', 'Low'].map((p) => (
                    <label
                      key={p}
                      className={`flex-1 relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${form.priority === p
                          ? p === 'High'
                            ? 'border-red-500 bg-red-50 text-red-700 shadow-sm shadow-red-200'
                            : p === 'Medium'
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm shadow-orange-200'
                            : 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-200'
                          : 'border-gray-100 bg-gray-50 text-slate-500 hover:border-gray-200'
                        }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-bold">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your idea in detail — what problem does it solve and how?"
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Impact Section */}
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                <h3 className="text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                  📊 Expected Impact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Time Saved
                    </label>
                    <input
                      name="timeSaved"
                      value={form.timeSaved}
                      onChange={handleChange}
                      placeholder="e.g., 40 hours/month"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Cost Saved
                    </label>
                    <input
                      name="costSaved"
                      value={form.costSaved}
                      onChange={handleChange}
                      placeholder="e.g. ₹5000/year"
                      className="input-field text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Additional Notes
                  </label>
                  <input
                    name="impactNotes"
                    value={form.impactNotes}
                    onChange={handleChange}
                    placeholder="Any other impact details"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📎 Attach Images <span className="text-xs text-slate-400 font-normal">(max 5, 5MB each)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-primary-400
                             rounded-xl p-4 text-center transition-colors group cursor-pointer"
                >
                  <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-primary-500 mx-auto mb-1 transition-colors" />
                  <p className="text-sm text-gray-500 group-hover:text-primary-600">
                    Click to upload images
                  </p>
                </button>

                {/* Image Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group/img aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg
                                     opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {initialData ? 'Save Changes' : 'Submit Idea'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}