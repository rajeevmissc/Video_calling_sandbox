import React, { useState, useMemo } from 'react';
import {
    Users, MessageCircle, Video, Phone,
    MapPin, Star, Search, X, ChevronRight
} from 'lucide-react';
import serviceCategories from '../../data/serviceCategories';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const ServicesExplorer = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();
    // Smart search function that ranks results by relevance
    const searchAllServices = (query) => {
        if (!query.trim()) return [];

        const searchTerm = query.toLowerCase();
        const results = [];

        serviceCategories.forEach((category) => {
            category.services.forEach((service) => {
                const serviceName = service.skill.toLowerCase();
                let relevanceScore = 0;

                // Exact match gets highest score
                if (serviceName === searchTerm) {
                    relevanceScore = 100;
                }
                // Starts with search term
                else if (serviceName.startsWith(searchTerm)) {
                    relevanceScore = 90;
                }
                // Contains search term as whole word
                else if (serviceName.includes(` ${searchTerm} `) ||
                    serviceName.includes(` ${searchTerm}`) ||
                    serviceName.includes(`${searchTerm} `)) {
                    relevanceScore = 80;
                }
                // Contains search term anywhere
                else if (serviceName.includes(searchTerm)) {
                    relevanceScore = 70;
                }
                // Individual word match
                else {
                    const searchWords = searchTerm.split(' ');
                    const matchingWords = searchWords.filter(word => serviceName.includes(word));
                    if (matchingWords.length > 0) {
                        relevanceScore = 50 + (matchingWords.length * 10);
                    }
                }

                if (relevanceScore > 0) {
                    results.push({
                        ...service,
                        category: category.title,
                        categoryIndex: serviceCategories.indexOf(category),
                        relevanceScore
                    });
                }
            });
        });

        // Sort by relevance score (highest first)
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    };

    // Get filtered services based on search and category
    const getFilteredServices = useMemo(() => {
        if (searchQuery.trim()) {
            return searchAllServices(searchQuery);
        }

        if (selectedCategory === 'all') {
            const allServices = [];
            serviceCategories.forEach((category, categoryIndex) => {
                category.services.forEach((service) => {
                    allServices.push({
                        ...service,
                        category: category.title,
                        categoryIndex
                    });
                });
            });
            return allServices;
        }

        const categoryIndex = parseInt(selectedCategory);
        return serviceCategories[categoryIndex].services.map(service => ({
            ...service,
            category: serviceCategories[categoryIndex].title,
            categoryIndex
        }));
    }, [searchQuery, selectedCategory]);

    const getDemandColor = (demand) => {
        switch (demand) {
            case 'High': return 'text-emerald-600 bg-emerald-50';
            case 'Medium': return 'text-amber-600 bg-amber-50';
            case 'Low': return 'text-slate-600 bg-slate-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const handleServiceClick = (serviceType, category) => {
        // onServiceSelect?.({
        //     type: serviceType,
        //     timestamp: new Date().toISOString()
        // });
        navigate(`/services?skill=${encodeURIComponent(category)}`, {
            state: {
                serviceType,
                timestamp: new Date().toISOString()
            }
        });
    };

    return (
        <>
            <Helmet>
                <title>Our Services | Emotional Support & Companionship | GetCompanion</title>
                <meta name="description" content="Explore a variety of emotional support services including conversation sessions, companionship, emotional guidance, senior support and more." />
                <meta name="keywords" content="companionship services India, emotional support sessions, conversation service, senior companionship India" />

                <meta property="og:title" content="GetCompanion Services." />
                <meta property="og:description" content="Choose from emotional support, companionship and wellness-based interactions." />
                <meta property="og:image" content="/seo-logo.png" />
            </Helmet>

            <div className="min-h-screen bg-slate-50">
                {/* Category Tabs - Flex Wrap */}
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                            {/* All Services Tab */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchQuery('');
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <span>All Services</span>
                            </button>

                            {/* Category Tabs */}
                            {serviceCategories.map((category, index) => {
                                const IconComponent = category.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedCategory(index.toString());
                                            setSearchQuery('');
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === index.toString()
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span>{category.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Results Info */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between gap-4">

                            {/* Left Section: Title + Description */}
                            {searchQuery ? (
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                                        Search Results
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Found {getFilteredServices.length}{" "}
                                        {getFilteredServices.length === 1 ? "service" : "services"} matching "
                                        {searchQuery}"
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                                        {selectedCategory === "all"
                                            ? "All Services"
                                            : serviceCategories[parseInt(selectedCategory)]?.title}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        {selectedCategory === "all"
                                            ? ``
                                            : serviceCategories[parseInt(selectedCategory)]?.description}
                                    </p>
                                </div>
                            )}

                            {/* Right Section: Search Bar */}
                            <div className="relative max-w-md ml-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search across all services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getFilteredServices.map((service, index) => {
                            const ServiceIcon = service.icon;
                            return (
                                <div
                                    key={`${service.categoryIndex}-${index}`}
                                    onClick={() => setSelectedService(service)}
                                    className="bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                                >
                                    {/* Service Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors">
                                            <ServiceIcon className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor(service.demand)}`}>
                                                {service.demand}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-medium text-slate-700">{service.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Name */}
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[40px]">
                                        {service.skill}
                                    </h3>

                                    {/* Category Badge (shown when searching or viewing all) */}
                                    {(searchQuery || selectedCategory === 'all') && (
                                        <div className="mb-3">
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                {service.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* Starting Price */}
                                    <div className="mb-3 pb-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {service.startingPrice}
                                        </p>
                                    </div>

                                    {/* Quick Pricing */}
                                    <div className="space-y-1.5 mb-3">

                                        {/* Chat */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 flex items-center gap-1">
                                                <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                                                Discreet Chat
                                            </span>
                                            <span className={`font-medium ${service.pricing.chat === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                }`}>
                                                {service.pricing.chat}
                                            </span>
                                        </div>

                                        {/* Audio */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5 text-slate-600" />
                                                Discreet Audio
                                            </span>
                                            <span className={`font-medium ${service.pricing.audio === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                }`}>
                                                {service.pricing.audio}
                                            </span>
                                        </div>

                                        {/* Video */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 flex items-center gap-1">
                                                <Video className="w-3.5 h-3.5 text-slate-600" />
                                                Discreet Video
                                            </span>
                                            <span className={`font-medium ${service.pricing.video === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                }`}>
                                                {service.pricing.video}
                                            </span>
                                        </div>
                                        {/* In-Person Visit */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-slate-600" />
                                                In-Person Visit
                                            </span>
                                            <span className={`font-medium ${service.pricing.inPerson === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                }`}>
                                                {service.pricing.inPerson}
                                            </span>
                                        </div>

                                    </div>


                                    {/* View Details */}
                                    <div className="flex items-center justify-between text-xs font-medium text-slate-700 group-hover:text-slate-900">
                                        <span>View details</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* No Results */}
                    {getFilteredServices.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 mb-1">No services found</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try different keywords.`
                                    : 'No services available in this category.'}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                View All Services
                            </button>
                        </div>
                    )}
                </div>

                {/* Service Detail Modal */}
                {selectedService && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedService(null)}
                    >
                        <div
                            className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    {(() => {
                                        const ServiceIcon = selectedService.icon;
                                        return (
                                            <div className="p-2 rounded-lg bg-slate-50">
                                                <ServiceIcon className="w-5 h-5 text-slate-700" />
                                            </div>
                                        );
                                    })()}
                                    <div className="flex-1">
                                        <h2 className="text-base font-semibold text-slate-900 mb-1">
                                            {selectedService.skill}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span className="font-medium text-slate-700">{selectedService.rating}</span>
                                            </div>
                                            <span className="text-slate-400">•</span>
                                            <span className={`px-2 py-0.5 rounded-full font-medium ${getDemandColor(selectedService.demand)}`}>
                                                {selectedService.demand} Demand
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* Category Info */}
                                <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-0.5">Category</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {selectedService.category}
                                    </p>
                                </div>

                                {/* Pricing Options */}
                                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                    Choose Connection Type
                                </h3>
                                <div className="space-y-2 mb-6">
                                    {/* Chat Option */}
                                    <div className={`p-4 rounded-lg border transition-all ${selectedService.pricing.chat === 'Not Available'
                                        ? 'border-slate-100 bg-slate-50 opacity-60'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                        onClick={() => handleServiceClick('chat', selectedService)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MessageCircle className={`w-5 h-5 ${selectedService.pricing.chat === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Discreet Chat</p>
                                                    <p className="text-xs text-slate-500">Text messaging, & Share</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-semibold ${selectedService.pricing.chat === 'Not Available' ? 'text-slate-400' : 'text-slate-900'
                                                }`}>
                                                {selectedService.pricing.chat}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Audio Option */}
                                    <div className={`p-4 rounded-lg border transition-all ${selectedService.pricing.audio === 'Not Available'
                                        ? 'border-slate-100 bg-slate-50 opacity-60'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                        onClick={() => handleServiceClick('call')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Phone className={`w-5 h-5 ${selectedService.pricing.audio === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Discreet Audio Call</p>
                                                    <p className="text-xs text-slate-500">Voice chat, Screen & Share</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-semibold ${selectedService.pricing.audio === 'Not Available' ? 'text-slate-400' : 'text-slate-900'
                                                }`}>
                                                {selectedService.pricing.audio}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Video Option */}
                                    <div className={`p-4 rounded-lg border transition-all ${selectedService.pricing.video === 'Not Available'
                                        ? 'border-slate-100 bg-slate-50 opacity-60'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                        onClick={() => handleServiceClick('video')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Video className={`w-5 h-5 ${selectedService.pricing.video === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900"> Discreet Video Call</p>
                                                    <p className="text-xs text-slate-500">Video, audio, chat & Share</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-semibold ${selectedService.pricing.video === 'Not Available' ? 'text-slate-400' : 'text-slate-900'
                                                }`}>
                                                {selectedService.pricing.video}
                                            </p>
                                        </div>
                                    </div>

                                    {/* In-Person Option */}
                                    <div className={`p-4 rounded-lg border transition-all ${selectedService.pricing.inPerson === 'Not Available'
                                        ? 'border-slate-100 bg-slate-50 opacity-60'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                        onClick={() => handleServiceClick('visit')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MapPin className={`w-5 h-5 ${selectedService.pricing.inPerson === 'Not Available' ? 'text-slate-400' : 'text-slate-700'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">In-Person</p>
                                                    <p className="text-xs text-slate-500">Meet in person</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-semibold ${selectedService.pricing.inPerson === 'Not Available' ? 'text-slate-400' : 'text-slate-900'
                                                }`}>
                                                {selectedService.pricing.inPerson}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                                        Book Now
                                    </button>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServicesExplorer;