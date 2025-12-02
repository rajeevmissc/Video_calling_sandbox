// import React, { useState, useEffect } from "react";
// import {
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   MapPin,
//   Phone,
//   Video,
//   Home,
//   Clock,
//   Languages,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useProviders } from "../../hooks/useProviders";

// const getInitials = (first = "", last = "") =>
//   `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();

// const ExpertsSection = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [itemsPerSlide, setItemsPerSlide] = useState(3);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const navigate = useNavigate();

//   const { providers, loading, error } = useProviders();

//   const handleViewProfile = (id) => navigate(`/provider/${id}`);

//   // Convert providers to clean objects
//   const experts = providers.map((p) => ({
//     id: p._id,
//     name: p.personalInfo?.fullName,
//     profession: p.services?.primary,
//     category: p.services?.category,
//     experience: p.professional?.experience || 0,
//     location: `${p.address?.city}, ${p.address?.state}`,
//     rating: p.ratings?.overall || 0,
//     reviews: p.ratings?.totalReviews || 0,
//     verified: p.professional?.verified,
//     profileImg: p.personalInfo?.profileImage,
//     initials: getInitials(p.personalInfo?.firstName, p.personalInfo?.lastName),
//     languages: p.professional?.languages || [],
//     responseTime: p.businessInfo?.responseTime || "Within 24 hours",
//     pricing: p.pricing || {
//       call: { basePrice: 0 },
//       video: { basePrice: 0 },
//       visit: { basePrice: 0 },
//     },
//     bio: p.personalInfo?.bio || "No bio available",
//     available: p.availability?.status === "available",
//   }));

//   // Responsive breakpoints
//   useEffect(() => {
//     const update = () => {
//       if (window.innerWidth >= 1024) setItemsPerSlide(3);
//       else if (window.innerWidth >= 640) setItemsPerSlide(2);
//       else setItemsPerSlide(1);
//     };
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   const totalSlides = Math.ceil(experts.length / itemsPerSlide);

//   // Auto-slide
//   useEffect(() => {
//     if (!isAutoPlaying || experts.length === 0) return;
//     const interval = setInterval(
//       () => setCurrentSlide((prev) => (prev + 1) % totalSlides),
//       4000
//     );
//     return () => clearInterval(interval);
//   }, [isAutoPlaying, totalSlides, experts.length]);

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
//   const prevSlide = () =>
//     setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

//   const goToSlide = (index) => setCurrentSlide(index);

//   if (loading || error || experts.length === 0) return null;

//   return (
//     <section id="experts" className="py-4 bg-white">
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Header */}
//         <div className="mb-12 text-center lg:text-left">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//             Our Expert Professionals
//           </h2>
//           <p className="text-gray-600 text-lg mt-2 max-w-2xl mx-auto lg:mx-0">
//             Connect with trained, compassionate, and verified professionals.
//           </p>
//         </div>

//         {/* Slider Section */}
//         <div className="relative mb-12">
//           <div className="overflow-hidden">
//             <div
//               className="flex transition-transform duration-700 ease-in-out"
//               style={{
//                 transform: `translateX(-${currentSlide * 100}%)`,
//               }}
//             >
//               {/* Slides */}
//               {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                 <div key={slideIndex} className="w-full flex-shrink-0">
//                   <div
//                     className={`grid gap-6 ${
//                       itemsPerSlide === 1
//                         ? "grid-cols-1"
//                         : itemsPerSlide === 2
//                         ? "grid-cols-2"
//                         : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                     }`}
//                   >
//                     {experts
//                       .slice(
//                         slideIndex * itemsPerSlide,
//                         (slideIndex + 1) * itemsPerSlide
//                       )
//                       .map((expert) => (
//                         <article
//                           key={expert.id}
//                           className="
//                             bg-[#F0F0F0] border border-gray-300 rounded-2xl p-6 
//                             shadow-md hover:shadow-xl hover:-translate-y-1 
//                             transition-all"
//                         >
//                           {/* Top badges */}
//                           <div className="flex items-center justify-between mb-4">
//                             {expert.available && (
//                               <span className="px-3 py-1 flex items-center gap-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
//                                 <CheckCircle className="w-3 h-3" /> Verified
//                               </span>
//                             )}

//                             {expert.available && (
//                               <span className="px-3 py-1 flex items-center gap-1 bg-white border border-gray-300 rounded-full text-xs text-emerald-700">
//                                 {/* <Clock className="w-3 h-3" /> Verified */}
//                               </span>
//                             )}
//                           </div>

//                           {/* Avatar + Title */}
//                           <div className="flex items-center gap-4 mb-4">
//                             <div className="w-16 h-16 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center text-gray-700 text-lg font-semibold overflow-hidden">
//                               {expert.profileImg ? (
//                                 <img
//                                   src={expert.profileImg}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 expert.initials
//                               )}
//                             </div>

//                             <div className="min-w-0">
//                               <h3 className="font-semibold text-gray-900 text-base truncate">
//                                 {expert.name}
//                               </h3>
//                               <p className="text-sm text-gray-700">
//                                 {expert.profession}
//                               </p>
//                               <span className="inline-block mt-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-800">
//                                 {expert.category}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Bio */}
//                           <p className="text-sm text-gray-700 line-clamp-2 mb-4">
//                             {expert.bio}
//                           </p>

//                           {/* Info Grid */}
//                           <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
//                             <div className="flex items-center gap-1">
//                               <Clock className="w-4 h-4 text-gray-500" />
//                               {expert.experience} yrs exp
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <MapPin className="w-4 h-4 text-gray-500" />
//                               {expert.location}
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                               {expert.rating} ({expert.reviews})
//                             </div>
//                             <div className="flex items-center gap-1 truncate">
//                               <Languages className="w-4 h-4 text-gray-500" />
//                               {expert.languages.join(", ")}
//                             </div>
//                           </div>

//                           <div className="border-t border-gray-300 my-4"></div>

//                           {/* Response Time */}
//                           <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
//                             <Clock className="w-3 h-3 text-gray-500" />
//                             Response: {expert.responseTime}
//                           </div>

//                           {/* Pricing */}
//                           <div className="bg-white border border-gray-300 rounded-xl p-3 mb-4">
//                             <div className="grid grid-cols-3 text-center text-xs text-gray-600 gap-3">
//                               <div>
//                                 <Phone className="w-4 h-4 mx-auto text-gray-600" />
//                                 Call
//                                 <p className="text-gray-900 font-semibold text-sm">
//                                   ₹{expert.pricing.call.basePrice}
//                                   <span className="text-gray-500 text-xs">
//                                     /min
//                                   </span>
//                                 </p>
//                               </div>

//                               <div>
//                                 <Video className="w-4 h-4 mx-auto text-gray-600" />
//                                 Video
//                                 <p className="text-gray-900 font-semibold text-sm">
//                                   ₹{expert.pricing.video.basePrice}
//                                   <span className="text-gray-500 text-xs">
//                                     /min
//                                   </span>
//                                 </p>
//                               </div>

//                               <div>
//                                 <Home className="w-4 h-4 mx-auto text-gray-600" />
//                                 Visit
//                                 <p className="text-gray-900 font-semibold text-sm">
//                                   ₹{expert.pricing.visit.basePrice}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>

//                           {/* CTA */}
//                           <button
//                             onClick={() => handleViewProfile(expert.id)}
//                             className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all hover:shadow-md"
//                           >
//                             View Profile
//                           </button>
//                         </article>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* DOTS + BUTTONS BELOW */}
//           {totalSlides > 1 && (
//             <div className="flex items-center justify-center gap-4 mt-6">
//               {/* Left Button */}
//               <button
//                 onClick={prevSlide}
//                 className="bg-[#F0F0F0] border border-gray-300 shadow-md rounded-full p-2.5 hover:bg-gray-50 hover:scale-110 transition-all"
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-700" />
//               </button>

//               {/* Dots */}
//               <div className="flex items-center gap-2">
//                 {Array.from({ length: totalSlides }).map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => goToSlide(i)}
//                     className={`h-2 rounded-full transition-all ${
//                       i === currentSlide ? "bg-gray-900 w-6" : "bg-gray-300 w-2"
//                     }`}
//                   />
//                 ))}
//               </div>

//               {/* Right Button */}
//               <button
//                 onClick={nextSlide}
//                 className="bg-[#F0F0F0] border border-gray-300 shadow-md rounded-full p-2.5 hover:bg-gray-50 hover:scale-110 transition-all"
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-700" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ExpertsSection;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MapPin,
  Phone,
  Video,
  Home,
  Clock,
  Languages,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProviders } from "../../hooks/useProviders";

/* ------------------------- Utility ------------------------- */
const getInitials = (f = "", l = "") =>
  `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

/* ============================================================
   MAIN COMPONENT
============================================================ */
const ExpertsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const navigate = useNavigate();
  const { providers, loading, error } = useProviders();

  /* ---------------------- Safe Provider Mapping ---------------------- */
  const experts = useMemo(() => {
    if (!providers?.length) return [];

    return providers.map((p) => ({
      id: p?._id,
      name: p?.personalInfo?.fullName || "Unknown",
      profession: p?.services?.primary || "Not specified",
      category: p?.services?.category || "General",
      experience: p?.professional?.experience || 0,
      location:
        `${p?.address?.city || ""}, ${p?.address?.state || ""}`.trim() ||
        "Not available",

      rating: p?.ratings?.overall ?? 0,
      reviews: p?.ratings?.totalReviews ?? 0,

      verified: p?.professional?.verified ?? false,
      profileImg: p?.personalInfo?.profileImage || null,

      initials: getInitials(
        p?.personalInfo?.firstName,
        p?.personalInfo?.lastName
      ),

      languages: p?.professional?.languages || [],

      responseTime: p?.businessInfo?.responseTime || "Within 24 hours",

      pricing: {
        call: { basePrice: p?.pricing?.call?.basePrice ?? 0 },
        video: { basePrice: p?.pricing?.video?.basePrice ?? 0 },
        visit: { basePrice: p?.pricing?.visit?.basePrice ?? 0 },
      },

      bio: p?.personalInfo?.bio || "No bio available",
      available: p?.availability?.status === "available",
    }));
  }, [providers]);

  /* ---------------------- Responsive Breakpoints ---------------------- */
  useEffect(() => {
    const updateBreakpoints = () => {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerSlide(3);
      else if (w >= 640) setItemsPerSlide(2);
      else setItemsPerSlide(1);
    };
    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  /* ---------------------- Total Slides ---------------------- */
  const totalSlides = useMemo(
    () => Math.ceil(experts.length / itemsPerSlide),
    [experts.length, itemsPerSlide]
  );

  /* ---------------------- Auto Slide ---------------------- */
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;
    const interval = setInterval(
      () => setCurrentSlide((s) => (s + 1) % totalSlides),
      4000
    );
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  /* ---------------------- Navigation ---------------------- */
  const nextSlide = useCallback(
    () => setCurrentSlide((s) => (s + 1) % totalSlides),
    [totalSlides]
  );

  const prevSlide = useCallback(
    () => setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides),
    [totalSlides]
  );

  const goToSlide = useCallback((i) => setCurrentSlide(i), []);

  const handleViewProfile = useCallback(
    (id) => navigate(`/provider/${id}`),
    [navigate]
  );

  /* ---------------------- UI Guard ---------------------- */
  if (loading || error || experts.length === 0) return null;

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <section id="experts" className="py-4 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Expert Professionals
          </h2>
          <p className="text-gray-600 text-lg mt-2 max-w-2xl mx-auto lg:mx-0">
            Connect with trained, compassionate, and verified professionals.
          </p>
        </div>

        {/* Slider */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {/* Slides */}
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const start = slideIndex * itemsPerSlide;
                const slideExperts = experts.slice(start, start + itemsPerSlide);

                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div
                      className={`grid gap-6 ${
                        itemsPerSlide === 1
                          ? "grid-cols-1"
                          : itemsPerSlide === 2
                          ? "grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {slideExperts.map((expert) => (
                        <article
                          key={expert.id}
                          className="
                          bg-[#F0F0F0] border border-gray-300 rounded-2xl p-6 
                          shadow-md hover:shadow-xl hover:-translate-y-1 
                          transition-all"
                        >
                          {/* Verified Badge */}
                          <div className="flex items-center justify-between mb-4">
                            {expert.verified && (
                              <span className="px-3 py-1 flex items-center gap-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center text-gray-700 text-lg font-semibold overflow-hidden">
                              {expert.profileImg ? (
                                <img
                                  src={expert.profileImg}
                                  className="w-full h-full object-cover"
                                  alt={expert.name}
                                />
                              ) : (
                                expert.initials
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {expert.name}
                              </h3>
                              <p className="text-sm text-gray-700">
                                {expert.profession}
                              </p>
                              <span className="inline-block mt-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-800">
                                {expert.category}
                              </span>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                            {expert.bio}
                          </p>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              {expert.experience} yrs exp
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              {expert.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              {expert.rating} ({expert.reviews})
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <Languages className="w-4 h-4 text-gray-500" />
                              {expert.languages.join(", ") || "N/A"}
                            </div>
                          </div>

                          <div className="border-t border-gray-300 my-4" />

                          {/* Response Time */}
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
                            <Clock className="w-3 h-3 text-gray-500" />
                            Response: {expert.responseTime}
                          </div>

                          {/* Pricing */}
                          <div className="bg-white border border-gray-300 rounded-xl p-3 mb-4">
                            <div className="grid grid-cols-3 text-center text-xs text-gray-600 gap-3">
                              <div>
                                <Phone className="w-4 h-4 mx-auto text-gray-600" />
                                Call
                                <p className="text-gray-900 font-semibold text-sm">
                                  ₹{expert.pricing.call.basePrice}
                                  <span className="text-gray-500 text-xs">
                                    /min
                                  </span>
                                </p>
                              </div>

                              <div>
                                <Video className="w-4 h-4 mx-auto text-gray-600" />
                                Video
                                <p className="text-gray-900 font-semibold text-sm">
                                  ₹{expert.pricing.video.basePrice}
                                  <span className="text-gray-500 text-xs">
                                    /min
                                  </span>
                                </p>
                              </div>

                              <div>
                                <Home className="w-4 h-4 mx-auto text-gray-600" />
                                Visit
                                <p className="text-gray-900 font-semibold text-sm">
                                  ₹{expert.pricing.visit.basePrice}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            onClick={() => handleViewProfile(expert.id)}
                            className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all hover:shadow-md"
                          >
                            View Profile
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots + Controls */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="bg-[#F0F0F0] border border-gray-300 shadow-md rounded-full p-2.5 hover:bg-gray-50 hover:scale-110 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? "bg-gray-900 w-6" : "bg-gray-300 w-2"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-[#F0F0F0] border border-gray-300 shadow-md rounded-full p-2.5 hover:bg-gray-50 hover:scale-110 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ExpertsSection);

