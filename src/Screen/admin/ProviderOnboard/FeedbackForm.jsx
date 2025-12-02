import React, { useState } from 'react';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const { callDuration, channelName, callType, callData, totalCharged } = location.state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    providerId: callData?.providerId || '',
    providerName: callData?.providerName || '',
    clientName: 'User', // 👈 Default name
    sessionDate: new Date().toISOString().split('T')[0],
    overallRating: 0,
    comment: '',
    wouldRecommend: true, // 👈 Default to "Yes"
    verified: false
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  const renderStars = (rating, hoveredRating, onHover, onClick) => {
    const displayRating = hoveredRating || rating;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onClick(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleStarClick = (rating) => setFormData((prev) => ({ ...prev, overallRating: rating }));
  const handleStarHover = (rating) => setHoveredStar(rating);
  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!formData.overallRating || !formData.comment) {
      alert('Please fill in all required fields.');
      return;
    }

    if (formData.comment.length < 20) {
      alert('Please provide a more detailed comment (minimum 20 characters).');
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      callData: {
        callDuration,
        channelName,
        callType,
        totalCharged,
        ...callData
      }
    };

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            providerId: '',
            providerName: '',
            clientName: 'User', // Reset as User
            sessionDate: new Date().toISOString().split('T')[0],
            overallRating: 0,
            comment: '',
            wouldRecommend: true,
            verified: false
          });
        }, 10000);
      } else {
        alert(`Error: ${result.message || 'Failed to submit feedback'}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Submission failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Your feedback has been submitted successfully.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Share Your Feedback | Help Improve GetCompanion</title>
        <meta name="description" content="Submit feedback to improve your emotional support experience." />
        <meta name="keywords" content="feedback companionship app, service feedback India, user review emotional support" />
        <meta property="og:title" content="Share Feedback" />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Rate our happiness executive
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">Your opinion helps us improve.</p>
          </div>

          {/* Rating */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-5 text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Rate Your Experience *</h2>
              <div className="flex justify-center gap-2 mb-2">
                {renderStars(formData.overallRating, hoveredStar, handleStarHover, handleStarClick)}
              </div>
              {formData.overallRating > 0 && (
                <p className="text-sm text-gray-700 font-medium">{formData.overallRating} / 5</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-2">Your Feedback *</h2>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Please describe your experience..."
              />
              <p className={`text-xs mt-1 ${formData.comment.length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                Minimum 20 characters ({formData.comment.length})
              </p>
            </div>

            {/* Submit */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
