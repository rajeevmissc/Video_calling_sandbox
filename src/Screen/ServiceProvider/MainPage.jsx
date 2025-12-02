import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Star, Calendar, Clock, DollarSign,
    Edit2, Save, X, Check, AlertCircle, Briefcase, Award, Shield,
    ChevronRight, Plus, Trash2, Camera, Settings, Activity, TrendingUp,
} from 'lucide-react';
import Loader from '../../components/Loading';
import TransactionsTab from './Transactions';
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

const ProviderDetailsPage = () => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('totalEarning');
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [savingSlots, setSavingSlots] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
     const userData = JSON.parse(localStorage.getItem('userData') || '{}');
     const providerId  = userData.providerId
    useEffect(() => {
        fetchProviderData();
    }, [providerId]);

    const fetchProviderData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://socket-server-sandbox.onrender.com/api/providers/${providerId}`);
            const data = await response.json();

            if (data.success) {
                setProvider(data.data);
                setFormData(data.data);
            }
        } catch (error) {
            console.error('Error fetching provider:', error);
            showNotification('Error loading provider data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Ensure required fields are present
            const dataToSave = {
                ...formData,
                personalInfo: {
                    ...formData.personalInfo,
                    role: formData.personalInfo.role || provider.personalInfo.role || 'provider'
                },
                professional: {
                    ...formData.professional,
                    // Normalize qualifications - ensure each has a degree field
                    qualifications: (formData.professional.qualifications || []).map(qual => {
                        if (!qual) return null;

                        // If it has certification but no degree, use certification as degree
                        return {
                            ...qual,
                            degree: qual.degree || qual.certification || 'Certification'
                        };
                    }).filter(qual => qual !== null)
                }
            };

            console.log('Sending data:', dataToSave); // Debug log

            const response = await fetch(`https://socket-server-sandbox.onrender.com/api/providers/${providerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            const data = await response.json();

            if (data.success) {
                setProvider(data.data);
                setFormData(data.data);
                setEditMode(false);
                showNotification('Provider details updated successfully', 'success');
            } else {
                showNotification(data.message || 'Failed to update provider details', 'error');
                console.error('Update error:', data);
            }
        } catch (error) {
            console.error('Error updating provider:', error);
            showNotification('Failed to update provider details', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(provider);
        setEditMode(false);
    };
    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        if (activeTab === 'slots' && selectedDate) {
            fetchSlots();
        }
    }, [selectedDate, activeTab]);

    const fetchSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `https://socket-server-sandbox.onrender.com/api/slots/${providerId}?date=${selectedDate}`,
                { headers }
            );

            const data = await response.json();

            if (data.success) {
                setSlots(data.data);
            } else {
                showNotification(data.message || 'Error loading slots', 'error');
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            showNotification('Error loading slots', 'error');
        }
    };

    const handleSlotToggle = (timeSlot) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to manage slots', 'error');
            return;
        }

        setSlots(prev => {
            const existingSlot = prev.find(s => s.timeSlot === timeSlot);

            if (existingSlot) {
                // Toggle between available and blocked
                const newStatus = existingSlot.status === 'available' ? 'blocked' : 'available';
                return prev.map(slot =>
                    slot.timeSlot === timeSlot ? { ...slot, status: newStatus } : slot
                );
            } else {
                // Add new slot
                return [...prev, {
                    timeSlot,
                    status: 'available',
                    date: selectedDate,
                    providerId
                }];
            }
        });
    };

    const handleBulkAction = (status) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to manage slots', 'error');
            return;
        }

        setSlots(TIME_SLOTS.map(timeSlot => ({
            timeSlot,
            status: status,
            date: selectedDate,
            providerId
        })));
    };

    const saveSlots = async () => {
        setSavingSlots(true);
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                showNotification('Please login to manage slots', 'error');
                setSavingSlots(false);
                return;
            }

            // Filter out only available and blocked slots (not booked ones)
            const slotsToSave = slots.filter(slot => slot.status !== 'booked');

            const response = await fetch(`https://socket-server-sandbox.onrender.com/api/slots/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    providerId,
                    date: selectedDate,
                    slots: slotsToSave
                })
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Slots updated successfully', 'success');
                fetchSlots(); // Refresh data
            } else {
                showNotification(data.message || 'Failed to update slots', 'error');
            }
        } catch (error) {
            console.error('Error saving slots:', error);
            showNotification('Error saving slots', 'error');
        } finally {
            setSavingSlots(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, field, index, value) => {
        const newArray = [...formData[section][field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: newArray
            }
        }));
    };

    const addArrayItem = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: [...prev[section][field], '']
            }
        }));
    };

    const removeArrayItem = (section, field, index) => {
        const newArray = formData[section][field].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: newArray
            }
        }));
    };

    if (loading) {
        return (
            <div>
               <Loader />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Provider not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {notification.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-start space-x-6">
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {provider.personalInfo.profileImage ? (
                                        <img
                                            src={provider.personalInfo.profileImage}
                                            alt="Profile"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        `${provider.personalInfo.firstName[0]}${provider.personalInfo.lastName[0]}`
                                    )}
                                </div>
                                {editMode && (
                                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                )}
                                {provider.presence?.isOnline && (
                                    <div className="absolute top-0 right-0 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {provider.personalInfo.fullName || `${provider.personalInfo.firstName} ${provider.personalInfo.lastName}`}
                                </h1>
                                <p className="text-lg text-gray-600 mt-1">{provider.services.primary}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                        <span className="font-semibold text-gray-900">{provider.ratings.overall}</span>
                                        <span className="text-gray-600">({provider.ratings.totalReviews} reviews)</span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <div className="flex items-center space-x-1 text-gray-600">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{provider.professional.experience} years exp.</span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <div className="flex items-center space-x-1 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{provider.address.city}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center space-x-2"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{provider.portfolio?.completedSessions || 0}</div>
                            <div className="text-sm text-gray-600">Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{provider.portfolio?.successRate || 0}%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{provider.portfolio?.repeatCustomers || 0}%</div>
                            <div className="text-sm text-gray-600">Repeat Customers</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        {[
                            {id: 'totalEarning', label: '₹ Total Earnings'},
                            { id: 'overview', label: 'Overview' },
                            { id: 'services', label: 'Services & Pricing' },
                            { id: 'availability', label: 'Availability' },
                            { id: 'slots', label: 'Manage Slots' },
                            { id: 'portfolio', label: 'Portfolio' },
                            { id: 'reviews', label: 'Reviews' },
                            { id: 'settings', label: 'Settings' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                         {activeTab === 'totalEarning' && (
                          <TransactionsTab  provider={provider.personalInfo.fullName}/>
                         )}
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <>
                                {/* About Section */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">About</h2>
                                        {editMode && <Edit2 className="h-4 w-4 text-gray-400" />}
                                    </div>
                                    {editMode ? (
                                        <textarea
                                            value={formData.personalInfo.bio}
                                            onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="text-gray-700 leading-relaxed">{provider.personalInfo.bio}</p>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600">Email</div>
                                                {editMode ? (
                                                    <input
                                                        type="email"
                                                        value={formData.personalInfo.email}
                                                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <div className="text-gray-900 font-medium">{provider.personalInfo.email}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600">Phone</div>
                                                {editMode ? (
                                                    <input
                                                        type="tel"
                                                        value={formData.personalInfo.phone}
                                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <div className="text-gray-900 font-medium">{provider.personalInfo.phone}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600">Address</div>
                                                {editMode ? (
                                                    <div className="space-y-2 mt-1">
                                                        <input
                                                            type="text"
                                                            value={formData.address.street}
                                                            onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                                                            placeholder="Street"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={formData.address.city}
                                                                onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                                                                placeholder="City"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.address.state}
                                                                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                                                                placeholder="State"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={formData.address.pincode}
                                                                onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                                                                placeholder="Pincode"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.address.country}
                                                                onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                                                                placeholder="Country"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-900 font-medium">
                                                        {provider.address.street}, {provider.address.city}<br />
                                                        {provider.address.state} - {provider.address.pincode}, {provider.address.country}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>

                                    {/* Experience */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-semibold text-gray-900">Experience</h3>
                                        </div>
                                        {editMode ? (
                                            <input
                                                type="number"
                                                value={formData.professional.experience}
                                                onChange={(e) => handleInputChange('professional', 'experience', parseInt(e.target.value))}
                                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-700">{provider.professional.experience} years of professional experience</p>
                                        )}
                                    </div>

                                    {/* Languages */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {provider.professional?.languages?.map((lang, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                    {lang}
                                                </span>
                                            )) || <p className="text-gray-500 text-sm">No languages listed</p>}
                                        </div>
                                    </div>

                                    {/* Qualifications */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Award className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-semibold text-gray-900">Qualifications</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {provider.professional?.qualifications?.map((qual, index) => (
                                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                                    <div className="font-medium text-gray-900">
                                                        {qual.degree || qual.certification}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {qual.institution} • {qual.year}
                                                        {qual.specialization && <> • {qual.specialization}</>}
                                                    </div>
                                                </div>
                                            )) || <p className="text-gray-500 text-sm">No qualifications listed</p>}
                                        </div>
                                    </div>

                                    {/* Specializations */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {provider.professional?.specializations?.map((spec, index) => (
                                                <div key={index} className="flex items-center space-x-2 text-gray-700">
                                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm">{spec}</span>
                                                </div>
                                            )) || <p className="text-gray-500 text-sm">No specializations listed</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                {provider.professional.verified && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <div className="flex items-center space-x-3">
                                            <Shield className="h-6 w-6 text-green-600" />
                                            <div>
                                                <h3 className="font-semibold text-green-900">Verified Professional</h3>
                                                <p className="text-sm text-green-700 mt-1">
                                                    Verified on {new Date(provider.professional.verificationDate).toLocaleDateString()}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {provider.professional.verificationDocuments.map((doc, index) => (
                                                        <span key={index} className="px-2 py-1 bg-white text-green-700 rounded text-xs font-medium border border-green-200">
                                                            {doc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Services & Pricing Tab */}
                        {/* Services & Pricing Tab */}
                        {activeTab === 'services' && (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>

                                    {/* Primary Service */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">Primary Service</h3>
                                        {editMode ? (
                                            <select
                                                value={formData.services.primary}
                                                onChange={(e) => handleInputChange('services', 'primary', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Primary Service</option>
                                                {Object.entries(serviceCategories).map(([category, services]) => (
                                                    <optgroup key={category} label={category}>
                                                        {services.map(service => (
                                                            <option key={service} value={service}>{service}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                                                {provider.services.primary}
                                            </div>
                                        )}
                                    </div>

                                    {/* Secondary Services */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Secondary Services</h3>
                                        {editMode ? (
                                            <div className="space-y-2">
                                                {(formData.services?.secondary || []).map((service, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <select
                                                            value={service}
                                                            onChange={(e) => handleArrayChange('services', 'secondary', index, e.target.value)}
                                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Select Secondary Service</option>
                                                            {Object.entries(serviceCategories).map(([category, services]) => (
                                                                <optgroup key={category} label={category}>
                                                                    {services.map(serviceOption => (
                                                                        <option key={serviceOption} value={serviceOption}>{serviceOption}</option>
                                                                    ))}
                                                                </optgroup>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => removeArrayItem('services', 'secondary', index)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addArrayItem('services', 'secondary')}
                                                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center space-x-2"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    <span>Add Service</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {(provider.services?.secondary || []).map((service, index) => (
                                                    <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                        {service}
                                                    </span>
                                                ))}
                                                {(!provider.services?.secondary || provider.services.secondary.length === 0) && (
                                                    <p className="text-gray-500 text-sm">No secondary services listed</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Category & Subcategories */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Service Category</h3>
                                        {editMode ? (
                                            <div className="space-y-4">
                                                <select
                                                    value={formData.services?.category || ''}
                                                    onChange={(e) => handleInputChange('services', 'category', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select Service Category</option>
                                                    {Object.keys(serviceCategories).map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>

                                                {/* Auto-populate subcategories based on selected category */}
                                                {formData.services?.category && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Subcategories</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {serviceCategories[formData.services.category]?.map((subcategory, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${formData.services?.subcategories?.includes(subcategory)
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                                                        }`}
                                                                    onClick={() => {
                                                                        const currentSubcategories = formData.services?.subcategories || [];
                                                                        const isSelected = currentSubcategories.includes(subcategory);

                                                                        if (isSelected) {
                                                                            // Remove if already selected
                                                                            const updated = currentSubcategories.filter(item => item !== subcategory);
                                                                            handleInputChange('services', 'subcategories', updated);
                                                                        } else {
                                                                            // Add if not selected
                                                                            const updated = [...currentSubcategories, subcategory];
                                                                            handleInputChange('services', 'subcategories', updated);
                                                                        }
                                                                    }}
                                                                >
                                                                    {subcategory}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg inline-block font-medium">
                                                    {provider.services?.category || 'Not specified'}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(provider.services?.subcategories || []).map((subcat, index) => (
                                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                                                            {subcat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rest of the Services & Pricing tab content remains the same */}
                                {/* Pricing */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Call Pricing */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Phone className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-semibold text-gray-900">Call</h3>
                                            </div>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    value={formData.pricing.call.basePrice}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        pricing: {
                                                            ...prev.pricing,
                                                            call: {
                                                                ...prev.pricing.call,
                                                                basePrice: parseInt(e.target.value)
                                                            }
                                                        }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ₹{provider.pricing.call.basePrice}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        per {provider.pricing.call.duration} hour
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Video Pricing */}
                                        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Camera className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-semibold text-gray-900">Video</h3>
                                            </div>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    value={formData.pricing.video.basePrice}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        pricing: {
                                                            ...prev.pricing,
                                                            video: {
                                                                ...prev.pricing.video,
                                                                basePrice: parseInt(e.target.value)
                                                            }
                                                        }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ₹{provider.pricing.video.basePrice}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        per {provider.pricing.video.duration} hour
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Visit Pricing */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-semibold text-gray-900">Visit</h3>
                                            </div>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    value={formData.pricing.visit.basePrice}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        pricing: {
                                                            ...prev.pricing,
                                                            visit: {
                                                                ...prev.pricing.visit,
                                                                basePrice: parseInt(e.target.value)
                                                            }
                                                        }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ₹{provider.pricing.visit.basePrice}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        per {provider.pricing.visit.duration} minutes
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Within {provider.pricing.visit.travelRadius}km radius
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extra Charges */}
                                    {provider.pricing.visit.extraCharges && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2">Additional Charges</h4>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div>• Travel beyond {provider.pricing.visit.travelRadius}km: ₹{provider.pricing.visit.extraCharges.travelBeyond15km}/km</div>
                                                <div>• Equipment setup: ₹{provider.pricing.visit.extraCharges.equipmentSetup}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Service Areas */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Areas</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.businessInfo.serviceAreas.map((area, index) => (
                                            <span key={index} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{area}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Equipment & Resources</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {provider.businessInfo.equipment.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-gray-700">
                                                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Availability Tab */}
                        {activeTab === 'availability' && (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Availability Status</h2>
                                        <div className="flex items-center space-x-2">
                                            <div className={`h-3 w-3 rounded-full ${provider.availability.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className={`font-medium ${provider.availability.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                                                {provider.availability.status === 'available' ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Working Hours */}
                                    <h3 className="font-semibold text-gray-900 mb-4">Working Hours</h3>
                                    <div className="space-y-3">
                                        {Object.entries(provider.availability.workingHours).map(([day, hours]) => (
                                            <div key={day} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {editMode && (
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.availability.workingHours[day] !== null}
                                                            className="h-4 w-4 text-blue-600 rounded"
                                                        />
                                                    )}
                                                    <span className="font-medium text-gray-900 capitalize w-24">{day}</span>
                                                </div>
                                                {editMode ? (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="time"
                                                            value={formData.availability.workingHours[day]?.start || ''}
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <span className="text-gray-500">to</span>
                                                        <input
                                                            type="time"
                                                            value={formData.availability.workingHours[day]?.end || ''}
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600">
                                                        {hours.start} - {hours.end}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Booked Slots */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
                                    {provider.availability.bookedSlots.length > 0 ? (
                                        <div className="space-y-3">
                                            {provider.availability.bookedSlots.map((slot, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <Calendar className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {new Date(slot.date).toLocaleDateString('en-IN', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-600">{slot.time}</div>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${slot.mode === 'video' ? 'bg-blue-100 text-blue-700' :
                                                            slot.mode === 'call' ? 'bg-green-100 text-green-700' :
                                                                'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {slot.mode}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No upcoming bookings
                                        </div>
                                    )}
                                </div>

                                {/* Timezone */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm text-blue-900">
                                            All times are in <strong>{provider.availability.timezone}</strong> timezone
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Slots Management Tab */}
                        {activeTab === 'slots' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Manage Availability Slots</h2>
                                        <p className="text-gray-600 mt-1">Set your available time slots for bookings</p>
                                    </div>
                                    <button
                                        onClick={() => setShowSlotModal(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Slot Pattern</span>
                                    </button>
                                </div>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {TIME_SLOTS.map((timeSlot) => {
                                        const slot = slots.find(s => s.timeSlot === timeSlot);
                                        const isBooked = slot?.status === 'booked';
                                        const isAvailable = slot?.status === 'available';

                                        return (
                                            <div
                                                key={timeSlot}
                                                className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all ${isBooked
                                                        ? 'bg-red-50 border-red-200 text-red-700'
                                                        : isAvailable
                                                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                                    }`}
                                                onClick={() => !isBooked && handleSlotToggle(timeSlot)}
                                            >
                                                <div className="font-medium text-sm">{formatTime(timeSlot)}</div>
                                                <div className="text-xs mt-1">
                                                    {isBooked ? 'Booked' : isAvailable ? 'Available' : 'Not Set'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span className="text-sm text-gray-600">Available</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                                        <span className="text-sm text-gray-600">Booked</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                                        <span className="text-sm text-gray-600">Not Available</span>
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <button
                                        onClick={() => handleBulkAction('available')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                    >
                                        Mark All as Available
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('blocked')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                                    >
                                        Mark All as Busy
                                    </button>
                                    <button
                                        onClick={saveSlots}
                                        disabled={savingSlots}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                                    >
                                        {savingSlots ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Portfolio Tab */}
                        {activeTab === 'portfolio' && (
                            <>
                                {/* Achievements */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
                                    <div className="space-y-3">
                                        {provider.portfolio.achievements.map((achievement, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                                                <Award className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-900">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Media Files */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Media</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {provider.portfolio.mediaFiles.map((media, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {media.type === 'audio' ? (
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <Activity className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Camera className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-gray-900">{media.title}</div>
                                                            <div className="text-xs text-gray-500">{media.duration}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <a
                                                        href={media.url}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        View {media.type} →
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Testimonials */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Testimonials</h2>
                                    <div className="space-y-4">
                                        {provider.portfolio.testimonials.map((testimonial, index) => (
                                            <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{testimonial.client}</div>
                                                        <div className="flex items-center space-x-1 mt-1">
                                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {testimonial.verified && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center space-x-1">
                                                            <Check className="h-3 w-3" />
                                                            <span>Verified</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">{testimonial.comment}</p>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    {new Date(testimonial.date).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <>
                                {/* Rating Overview */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Overview</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Overall Rating */}
                                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                                            <div className="text-5xl font-bold text-gray-900">{provider.ratings.overall}</div>
                                            <div className="flex items-center justify-center space-x-1 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-6 w-6 ${i < Math.floor(provider.ratings.overall) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-gray-600 mt-2">{provider.ratings.totalReviews} reviews</div>
                                        </div>

                                        {/* Rating Breakdown */}
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = provider.ratings.breakdown[star] || 0;
                                                const percentage = (count / provider.ratings.totalReviews) * 100;
                                                return (
                                                    <div key={star} className="flex items-center space-x-3">
                                                        <span className="text-sm text-gray-600 w-12">{star} star</span>
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-600 w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Category Ratings */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-4">Category Ratings</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(provider.ratings.categories).map(([category, rating]) => (
                                                <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-900">{rating}</div>
                                                    <div className="text-xs text-gray-600 mt-1 capitalize">{category}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Policies</h2>

                                    <div className="space-y-6">
                                        {/* Response Time */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Response Time
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    value={formData.businessInfo.responseTime}
                                                    onChange={(e) => handleInputChange('businessInfo', 'responseTime', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{provider.businessInfo.responseTime}</p>
                                            )}
                                        </div>

                                        {/* Cancellation Policy */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cancellation Policy
                                            </label>
                                            {editMode ? (
                                                <textarea
                                                    value={formData.businessInfo.cancellationPolicy}
                                                    onChange={(e) => handleInputChange('businessInfo', 'cancellationPolicy', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{provider.businessInfo.cancellationPolicy}</p>
                                            )}
                                        </div>

                                        {/* Refund Policy */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Refund Policy
                                            </label>
                                            {editMode ? (
                                                <textarea
                                                    value={formData.businessInfo.refundPolicy}
                                                    onChange={(e) => handleInputChange('businessInfo', 'refundPolicy', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{provider.businessInfo.refundPolicy}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Availability</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${provider.presence?.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {provider.presence?.availabilityStatus || provider.availability.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Last Active</span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(provider.businessInfo.lastActive).toLocaleString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Member Since</span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(provider.businessInfo.joinDate).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Badges</h3>
                            <div className="space-y-2">
                                {provider.socialProof.badges.map((badge, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <Award className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-900">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Completed</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{provider.portfolio?.completedSessions || 0}</span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <Activity className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Success Rate</span>
                                    </div>
                                    <span className="font-semibold text-green-600">{provider.portfolio?.successRate || 0}%</span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Platform Rating</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{provider.platformStats?.platformRating || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Total Earnings</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">₹{(provider.platformStats?.totalEarnings || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
                            <h3 className="font-semibold mb-4">Need to Contact?</h3>
                            <div className="space-y-3">
                                <a
                                    href={`mailto:${provider.personalInfo.email}`}
                                    className="flex items-center space-x-3 p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                >
                                    <Mail className="h-5 w-5" />
                                    <span className="text-sm">Send Email</span>
                                </a>
                                <a
                                    href={`tel:${provider.personalInfo.phone}`}
                                    className="flex items-center space-x-3 p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                >
                                    <Phone className="h-5 w-5" />
                                    <span className="text-sm">Call Now</span>
                                </a>
                            </div>
                        </div>

                        {/* Verification Info */}
                        {provider.professional.verified && (
                            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Verified</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    This provider has been verified and background checked.
                                </p>
                                <div className="text-xs text-gray-500">
                                    Verified on {new Date(provider.professional.verificationDate).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetailsPage;