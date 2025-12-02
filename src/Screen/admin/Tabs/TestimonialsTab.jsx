import { useState, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.testimonials.all);
      setTestimonials(data.data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    try {
      const endpoint = action === 'approve' 
        ? API_ENDPOINTS.testimonials.approve(id)
        : API_ENDPOINTS.testimonials.reject(id);
      
      await fetchWithAuth(endpoint, { method: 'PATCH' });
      
      setTestimonials(prev =>
        prev.map(t =>
          t._id === id
            ? { ...t, status: action === 'approve' ? 'approved' : 'rejected' }
            : t
        )
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingTestimonials = testimonials.filter(t => t.status === 'pending');

  if (pendingTestimonials.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">✨</div>
        <div className="text-lg">No pending testimonials</div>
        <div className="text-sm">All testimonials have been reviewed</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {pendingTestimonials.map(t => (
        <div key={t._id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
            <div>
              <h4 className="font-semibold">{t.name}</h4>
              <p className="text-sm text-slate-600">{t.service}</p>
            </div>
            <div className="flex mt-2 sm:mt-0">
              {[...Array(t.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-700 mb-4">{t.testimonialText}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateStatus(t._id, 'approve')}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(t._id, 'reject')}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsTab;