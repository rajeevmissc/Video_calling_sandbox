import React, { useState } from 'react';
import { Camera, Plus, X, Check, ChevronRight, ChevronLeft, Search } from 'lucide-react';

const ProviderOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('');
  const [serviceAreaInput, setServiceAreaInput] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceCategories = {
    'Communication & Emotional Support': [
      'Active listening',
      'Empathy training',
      'Conflict resolution',
      'Storytelling',
      'Motivational speaking',
      'Public speaking',
      'Cross-cultural communication',
      'Stress counseling (non-clinical)',
      'Break-up support',
      'Conversational English practice'
    ],
    'Arts, Music & Creative Expression': [
      'Singing (Bollywood songs)',
      'Singing (Classical Indian music)',
      'Guitar playing',
      'Piano/Keyboard',
      'Tabla/Dholak',
      'Karaoke hosting',
      'Painting (acrylics, oils)',
      'Sketching & doodling',
      'Calligraphy',
      'Poetry recitation (Hindi/Urdu/Kavita)',
      'Creative writing coach',
      'Theatre/acting games',
      'Storytelling for kids',
      'Stand-up comedy basics',
      'Origami'
    ],
    'Reading & Knowledge Sharing': [
      'Reading books aloud',
      'Newspaper discussion',
      'History talks (Indian history)',
      'Mythology storytelling (Ramayana/Mahabharata)',
      'Science trivia sharing',
      'Current affairs discussion',
      'Spirituality talks',
      'Philosophy basics',
      'Mindfulness practices',
      'TED-talk style knowledge sharing'
    ],
    'Sports & Physical Activities': [
      'Chess partner',
      'Carrom partner',
      'Table tennis partner',
      'Badminton partner',
      'Cricket net practice buddy',
      'Football buddy',
      'Squash partner',
      'Volleyball partner',
      'Kabaddi partner',
      'Running/jogging companion',
      'Cycling buddy',
      'Yoga partner',
      'Meditation guide',
      'Zumba fitness partner',
      'Walking companion'
    ],
    'Games & Entertainment': [
      'Ludo',
      'Snakes & ladders',
      'Monopoly',
      'Cards (Rummy, UNO)',
      'Scrabble',
      'Crossword solving',
      'Puzzles (Sudoku, logic)',
      'Gaming (PlayStation/Xbox)',
      'Mobile gaming (PUBG/Free Fire)',
      'PC gaming (FIFA, Counter-Strike)'
    ],
    'Education & Skill Development': [
      'Basic English tutoring',
      'Hindi tutoring',
      'Spoken French practice',
      'Spoken Spanish practice',
      'Computer basics',
      'MS Office training',
      'Smartphone literacy for elders',
      'Social media basics',
      'Digital payments guidance',
      'Resume writing help',
      'Job interview practice',
      'Public speaking practice',
      'Financial literacy basics',
      'Goal setting & planning',
      'Basic coding (Scratch, Python)'
    ],
    'Lifestyle & Practical Help': [
      'Cooking simple Indian meals',
      'Baking cakes/cookies',
      'Tea/coffee making rituals',
      'Gardening basics',
      'Pet care & dog walking',
      'Grocery shopping companion',
      'Wardrobe organizing',
      'Decluttering coach',
      'Home decoration ideas',
      'Festival celebration guide (Diwali, Holi)'
    ],
    'Social & Cultural Engagement': [
      'Bollywood dance',
      'Classical dance (Kathak, Bharatanatyam)',
      'Folk dance (Bhangra, Garba)',
      'Karaoke nights',
      'Movie discussion club',
      'TV serial gossip',
      'Theatre appreciation',
      'Museum companion',
      'Temple/mosque/gurudwara companion',
      'Wedding/festival plus-one service'
    ],
    'Emotional Well-being & Mindfulness': [
      'Guided relaxation',
      'Breathing exercises',
      'Gratitude journaling companion',
      'Life reflections sharing',
      'Bucket list planning buddy'
    ]
  };

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      role:'provider',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bio: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    services: {
      primary: '',
      secondary: [],
      category: '',
      subcategories: []
    },
    professional: {
      experience: '',
      languages: [],
      specializations: [],
      qualifications: []
    },
    pricing: {
      chat: { perMinute: '', currency: 'INR' },
      call: { perMinute: '', currency: 'INR' },
      video: { perMinute: '', currency: 'INR' },
      visit: { basePrice: '', duration: 60, travelRadius: 15, currency: 'INR' }
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '10:00', end: '16:00' },
        sunday: { start: 'closed', end: 'closed' }
      }
    },
    businessInfo: {
      equipment: [],
      serviceAreas: [],
      cancellationPolicy: '24 hours notice required',
      refundPolicy: 'Full refund if cancelled 24 hours before session'
    }
  });

  const [tempInput, setTempInput] = useState('');
  const [tempQualification, setTempQualification] = useState({
    degree: '',
    institution: '',
    year: '',
    specialization: ''
  });

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic details' },
    { number: 2, title: 'Address', description: 'Location details' },
    { number: 3, title: 'Services', description: 'What you offer' },
    { number: 4, title: 'Professional', description: 'Experience & qualifications' },
    { number: 5, title: 'Pricing', description: 'Set your rates' },
    { number: 6, title: 'Availability', description: 'Working hours' },
    { number: 7, title: 'Business Info', description: 'Final details' }
  ];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addToArray = (section, field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...prev[section][field], value.trim()]
        }
      }));
    }
  };

  const removeFromArray = (section, field, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  const addQualification = () => {
    if (tempQualification.degree && tempQualification.institution && tempQualification.year) {
      setFormData(prev => ({
        ...prev,
        professional: {
          ...prev.professional,
          qualifications: [...prev.professional.qualifications, { ...tempQualification }]
        }
      }));
      setTempQualification({ degree: '', institution: '', year: '', specialization: '' });
    }
  };

  const toggleService = (service) => {
    const allServices = [...formData.services.secondary];
    if (allServices.includes(service)) {
      updateFormData('services', 'secondary', allServices.filter(s => s !== service));
    } else {
      updateFormData('services', 'secondary', [...allServices, service]);
    }
  };

  const toggleCategory = (category) => {
    const services = serviceCategories[category];
    const allSelected = services.every(service => formData.services.secondary.includes(service));
    
    if (allSelected) {
      const filtered = formData.services.secondary.filter(s => !services.includes(s));
      updateFormData('services', 'secondary', filtered);
    } else {
      const combined = [...new Set([...formData.services.secondary, ...services])];
      updateFormData('services', 'secondary', combined);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfilePhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  const isCategoryFullySelected = (category) => {
    const services = serviceCategories[category];
    return services.every(service => formData.services.secondary.includes(service));
  };

  const isCategoryPartiallySelected = (category) => {
    const services = serviceCategories[category];
    return services.some(service => formData.services.secondary.includes(service)) && 
           !services.every(service => formData.services.secondary.includes(service));
  };

const handleSubmit = async () => {
  if (!formData.personalInfo.firstName || !formData.personalInfo.lastName || 
      !formData.personalInfo.email || !formData.personalInfo.phone ||
      !formData.services.primary || !formData.services.category) {
    alert('Please fill in all required fields');
    return;
  }
  
  setIsSubmitting(true);
  
  const finalData = {
    personalInfo: {
      ...formData.personalInfo,
      fullName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
      profileImage: photoPreview || null
    },
    address: {
      ...formData.address,
      coordinates: { lat: 0, lng: 0 }
    },
    services: {
      ...formData.services
    },
    professional: {
      ...formData.professional,
      experience: parseInt(formData.professional.experience) || 0,
      verified: false,
      verificationDate: null,
      verificationDocuments: []
    },
    ratings: {
      overall: 0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      categories: {}
    },
    availability: {
      ...formData.availability,
      status: 'available',
      timezone: 'Asia/Kolkata',
      bookedSlots: []
    },
    pricing: {
      chat: { 
        basePrice: parseInt(formData.pricing.chat.perMinute) || 0,
        duration: 0, // Chat doesn't have fixed duration
        currency: 'INR',
        discounts: { bulk: { sessions: 10, discount: 15 }, firstTime: 20 } 
      },
      call: { 
        basePrice: parseInt(formData.pricing.call.perMinute) || 0,
        duration: 0, // Per minute pricing, so no fixed duration
        currency: 'INR',
        discounts: { bulk: { sessions: 10, discount: 15 }, firstTime: 20 } 
      },
      video: { 
        basePrice: parseInt(formData.pricing.video.perMinute) || 0,
        duration: 0, // Per minute pricing, so no fixed duration
        currency: 'INR',
        discounts: { bulk: { sessions: 10, discount: 15 }, firstTime: 20 } 
      },
      visit: { 
        basePrice: parseInt(formData.pricing.visit.basePrice) || 0,
        duration: parseInt(formData.pricing.visit.duration),
        travelRadius: parseInt(formData.pricing.visit.travelRadius),
        currency: 'INR', 
        extraCharges: {} 
      }
    },
    portfolio: {
      completedSessions: 0,
      successRate: 0,
      repeatCustomers: 0,
      achievements: [],
      mediaFiles: [],
      testimonials: []
    },
    businessInfo: {
      ...formData.businessInfo,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      responseTime: 'Within 2 hours'
    },
    socialProof: {
      badges: ['Verified Professional'],
      platformStats: {
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalEarnings: 0,
        platformRating: 0
      }
    }
  };
  
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
    const API_URL = `${API_BASE_URL}/providers`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert('🎉 Provider registered successfully!');        
      setFormData({
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '', bio: '' },
        address: { street: '', city: '', state: '', pincode: '', country: 'India' },
        services: { primary: '', secondary: [], category: '', subcategories: [] },
        professional: { experience: '', languages: [], specializations: [], qualifications: [] },
        pricing: { 
          chat: { perMinute: '', currency: 'INR' },
          call: { perMinute: '', currency: 'INR' },
          video: { perMinute: '', currency: 'INR' },
          visit: { basePrice: '', duration: 60, travelRadius: 15, currency: 'INR' }
        },
        availability: { workingHours: { monday: { start: '09:00', end: '18:00' }, tuesday: { start: '09:00', end: '18:00' }, wednesday: { start: '09:00', end: '18:00' }, thursday: { start: '09:00', end: '18:00' }, friday: { start: '09:00', end: '18:00' }, saturday: { start: '10:00', end: '16:00' }, sunday: { start: 'closed', end: 'closed' } } },
        businessInfo: { equipment: [], serviceAreas: [], cancellationPolicy: '24 hours notice required', refundPolicy: 'Full refund if cancelled 24 hours before session' }
      });
      setProfilePhoto(null);
      setPhotoPreview(null);
      setCurrentStep(1);
    } else {
      alert(`Error: ${result.message || 'Failed to register provider'}`);
      console.error('Server error:', result);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit form. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex flex-col items-center justify-center cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all border-4 border-dashed border-blue-300">
                    <Camera className="w-10 h-10 text-blue-600 mb-1" />
                    <span className="text-xs text-blue-600 font-medium">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {photoPreview ? 'Profile photo uploaded' : 'Upload profile photo (optional)'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Max size: 5MB • Format: JPG, PNG, GIF</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
              <textarea
                value={formData.personalInfo.bio}
                onChange={(e) => updateFormData('personalInfo', 'bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself and your expertise..."
              />
              <p className="text-xs text-gray-500 mt-1">Share your passion, experience, and what makes you unique</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => updateFormData('address', 'street', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Block A-123, Sector 14"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => updateFormData('address', 'city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Gurugram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => updateFormData('address', 'state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Haryana"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => updateFormData('address', 'pincode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="122001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => updateFormData('address', 'country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Category *</label>
              <select
                value={formData.services.category}
                onChange={(e) => {
                  updateFormData('services', 'category', e.target.value);
                  updateFormData('services', 'primary', '');
                  updateFormData('services', 'secondary', []);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {Object.keys(serviceCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {formData.services.category && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Services *</label>
                  <p className="text-xs text-gray-500 mb-4">Choose your primary service and additional services you can offer</p>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {Object.entries(serviceCategories).map(([category, services]) => (
                      <div key={category} className="border-b last:border-b-0 pb-3 last:pb-0">
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`cat-${category}`}
                            checked={isCategoryFullySelected(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            style={{
                              opacity: isCategoryPartiallySelected(category) ? 0.5 : 1
                            }}
                          />
                          <label 
                            htmlFor={`cat-${category}`}
                            className="ml-2 text-sm font-semibold text-gray-900 cursor-pointer"
                          >
                            {category} ({services.length})
                          </label>
                        </div>
                        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {services.map((service) => (
                            <div key={service} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`service-${service}`}
                                checked={formData.services.secondary.includes(service) || formData.services.primary === service}
                                onChange={() => {
                                  if (formData.services.primary === service) {
                                    return;
                                  }
                                  toggleService(service);
                                }}
                                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                              />
                              <label 
                                htmlFor={`service-${service}`}
                                className={`ml-2 text-sm cursor-pointer ${
                                  formData.services.primary === service 
                                    ? 'font-bold text-blue-600' 
                                    : 'text-gray-700'
                                }`}
                              >
                                {service}
                                {formData.services.primary === service && (
                                  <span className="ml-1 text-xs bg-blue-100 px-2 py-0.5 rounded-full">Primary</span>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {formData.services.secondary.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected Services ({formData.services.secondary.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.secondary.map((service, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                            {service}
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-green-900"
                              onClick={() => toggleService(service)}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Service *</label>
                  <select
                    value={formData.services.primary}
                    onChange={(e) => {
                      updateFormData('services', 'primary', e.target.value);
                      if (!formData.services.secondary.includes(e.target.value)) {
                        toggleService(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your primary service</option>
                    {formData.services.secondary.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {formData.services.primary && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Primary Service:</p>
                      <p className="text-blue-700">{formData.services.primary}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
              <input
                type="number"
                value={formData.professional.experience}
                onChange={(e) => updateFormData('professional', 'experience', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages You Speak *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('professional', 'languages', tempInput);
                      setTempInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hindi, English, Punjabi"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('professional', 'languages', tempInput);
                    setTempInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.professional.languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                    {lang}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-purple-900"
                      onClick={() => removeFromArray('professional', 'languages', index)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specializations (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">What are you particularly good at?</p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('professional', 'specializations', tempInput);
                      setTempInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bollywood playback singing techniques"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('professional', 'specializations', tempInput);
                    setTempInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.professional.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                    {spec}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-orange-900"
                      onClick={() => removeFromArray('professional', 'specializations', index)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications & Certifications</label>
              <p className="text-xs text-gray-500 mb-4">Add your educational background and certificates</p>
              <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={tempQualification.degree}
                  onChange={(e) => setTempQualification({ ...tempQualification, degree: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Degree/Certification Name *"
                />
                <input
                  type="text"
                  value={tempQualification.institution}
                  onChange={(e) => setTempQualification({ ...tempQualification, institution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Institution/University *"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={tempQualification.year}
                    onChange={(e) => setTempQualification({ ...tempQualification, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Year (e.g., 2015) *"
                  />
                  <input
                    type="text"
                    value={tempQualification.specialization}
                    onChange={(e) => setTempQualification({ ...tempQualification, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specialization (Optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addQualification}
                  disabled={!tempQualification.degree || !tempQualification.institution || !tempQualification.year}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Qualification
                </button>
              </div>
              {formData.professional.qualifications.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Added Qualifications:</p>
                  {formData.professional.qualifications.map((qual, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-medium text-gray-900">{qual.degree}</p>
                        <p className="text-sm text-gray-600">{qual.institution}, {qual.year}</p>
                        {qual.specialization && <p className="text-sm text-gray-500 mt-1">{qual.specialization}</p>}
                      </div>
                      <X
                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
                        onClick={() => removeFromArray('professional', 'qualifications', index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">Set your pricing for different session types. You can adjust these later.</p>
            
            <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Chat Sessions
              </h3>
              <p className="text-xs text-blue-700 mb-3">Text-based messaging conversations</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Price per Minute (₹) *</label>
                  <input
                    type="number"
                    value={formData.pricing.chat.perMinute}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        chat: { ...prev.pricing.chat, perMinute: e.target.value }
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customers will be charged per minute of chat conversation</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 mb-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Phone Call Sessions
              </h3>
              <p className="text-xs text-green-700 mb-3">Voice-only consultations</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Price per Minute (₹) *</label>
                  <input
                    type="number"
                    value={formData.pricing.call.perMinute}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        call: { ...prev.pricing.call, perMinute: e.target.value }
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="15"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customers will be charged per minute of phone conversation</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Video Call Sessions
              </h3>
              <p className="text-xs text-purple-700 mb-3">Face-to-face virtual meetings</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Price per Minute (₹) *</label>
                  <input
                    type="number"
                    value={formData.pricing.video.perMinute}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        video: { ...prev.pricing.video, perMinute: e.target.value }
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="20"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customers will be charged per minute of video call</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                In-Person Visits
              </h3>
              <p className="text-xs text-orange-700 mb-3">Face-to-face sessions at location</p>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.pricing.visit.basePrice}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        visit: { ...prev.pricing.visit, basePrice: e.target.value }
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="800"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Duration (minutes) *</label>
                  <select
                    value={formData.pricing.visit.duration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        visit: { ...prev.pricing.visit, duration: e.target.value }
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Travel Radius (km)</label>
                <input
                  type="number"
                  value={formData.pricing.visit.travelRadius}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      visit: { ...prev.pricing.visit, travelRadius: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="15"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum distance you're willing to travel</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> New providers often offer competitive introductory rates. You can always adjust your pricing later based on demand and experience.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Set your weekly schedule.</strong> You can mark days as closed or set specific working hours.
              </p>
            </div>
            
            {Object.keys(formData.availability.workingHours).map(day => (
              <div key={day} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <label className="text-sm font-semibold text-gray-900 capitalize w-24">{day}</label>
                  <div className="flex gap-3 items-center flex-1 flex-wrap">
                    {formData.availability.workingHours[day].start !== 'closed' ? (
                      <>
                        <input
                          type="time"
                          value={formData.availability.workingHours[day].start}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              workingHours: {
                                ...prev.availability.workingHours,
                                [day]: { ...prev.availability.workingHours[day], start: e.target.value }
                              }
                            }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500 font-medium">to</span>
                        <input
                          type="time"
                          value={formData.availability.workingHours[day].end}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              workingHours: {
                                ...prev.availability.workingHours,
                                [day]: { ...prev.availability.workingHours[day], end: e.target.value }
                              }
                            }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </>
                    ) : (
                      <span className="text-gray-500 italic">Closed</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          workingHours: {
                            ...prev.availability.workingHours,
                            [day]: formData.availability.workingHours[day].start === 'closed' 
                              ? { start: '09:00', end: '18:00' }
                              : { start: 'closed', end: 'closed' }
                          }
                        }
                      }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto ${
                        formData.availability.workingHours[day].start === 'closed'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {formData.availability.workingHours[day].start === 'closed' ? 'Mark Open' : 'Mark Closed'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-6">
              <p className="text-sm text-green-800">
                ✅ Your availability helps customers book sessions at convenient times. You can always update this later.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment/Tools You Use</label>
              <p className="text-xs text-gray-500 mb-3">List the equipment or tools you use for your services</p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('businessInfo', 'equipment', equipmentInput);
                      setEquipmentInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Harmonium, Professional microphone"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('businessInfo', 'equipment', equipmentInput);
                    setEquipmentInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.businessInfo.equipment.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2">
                    {item}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-indigo-900"
                      onClick={() => removeFromArray('businessInfo', 'equipment', index)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas *</label>
              <p className="text-xs text-gray-500 mb-3">Cities or areas where you provide services</p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={serviceAreaInput}
                  onChange={(e) => setServiceAreaInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('businessInfo', 'serviceAreas', serviceAreaInput);
                      setServiceAreaInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Gurugram, Delhi, Noida"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('businessInfo', 'serviceAreas', serviceAreaInput);
                    setServiceAreaInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.businessInfo.serviceAreas.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                    {area}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-teal-900"
                      onClick={() => removeFromArray('businessInfo', 'serviceAreas', index)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy *</label>
              <textarea
                value={formData.businessInfo.cancellationPolicy}
                onChange={(e) => updateFormData('businessInfo', 'cancellationPolicy', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 24 hours notice required for cancellation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy *</label>
              <textarea
                value={formData.businessInfo.refundPolicy}
                onChange={(e) => updateFormData('businessInfo', 'refundPolicy', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Full refund if cancelled 24 hours before session"
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Ready to Submit!</h3>
                  <p className="text-sm text-green-800">
                    You're all set! Review your information and click <strong>Submit Application</strong> to complete your registration as a service provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Service Provider Onboarding</h1>
          <p className="text-gray-600">Join our platform and start offering your services to customers</p>
        </div>

        <div className="mb-8 bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
          <div className="flex justify-between min-w-max md:min-w-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep === step.number
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="text-center mt-2 hidden md:block">
                    <p className="text-xs font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>

          {renderStep()}
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboardingForm;