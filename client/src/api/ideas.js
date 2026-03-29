import axios from 'axios';

const API = {
  // Ideas
  getIdeas: (params = {}) => axios.get('/api/ideas', { params }),
  getIdea: (id) => axios.get(`/api/ideas/${id}`),
  createIdea: (formData) =>
    axios.post('/api/ideas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateIdea: (id, data) => axios.put(`/api/ideas/${id}`, data),
  updateStatus: (id, data) => axios.patch(`/api/ideas/${id}/status`, data),
  deleteIdea: (id) => axios.delete(`/api/ideas/${id}`),
  getStats: () => axios.get('/api/ideas/stats/summary')
};

export default API;
