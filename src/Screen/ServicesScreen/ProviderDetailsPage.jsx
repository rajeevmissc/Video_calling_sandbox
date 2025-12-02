import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Star, MapPin, Clock, Award, CheckCircle, Phone,
  Calendar, MessageCircle, Shield, Globe, Heart, TrendingUp,
  ThumbsUp, Sparkles, Users, Zap, BookOpen, Mail, Video, ShieldCheck,
  LogIn, Loader2
} from 'lucide-react';
import { getFullProviderData } from '../../data/serviceData';
import { BookingModal } from '../../Screen/Booking/components/BookingModal';
import { WalletCheck } from '../Booking/components/WalletCheck';
import axios from 'axios';
import BannerImage from "../../Logos/ProfileBanner.png"
import { Helmet } from 'react-helmet-async';
// ==================== CONSTANTS ====================
const MODE_CONFIGS = {
  call: {
    icon: Phone,
    label: 'Phone Call',
    buttonText: 'Start Call',
    description: 'Connect instantly via phone',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    dotColor: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-600'
  },
  video: {
    icon: Video,
    label: 'Video Call',
    buttonText: 'Start Video Call',
    description: 'Connect face-to-face online',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    buttonClass: 'bg-purple-600 hover:bg-purple-700',
    dotColor: 'bg-purple-500',
    gradient: 'from-purple-500 to-indigo-600'
  },
  chat: {
    icon: MessageCircle,
    label: 'Chat',
    buttonText: 'Start Chat',
    description: 'Instant messaging session',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    dotColor: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-600'
  },
  visit: {
    icon: Calendar,
    label: 'In-Person Visit',
    buttonText: 'Book Appointment',
    description: 'Schedule an in-person visit',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    dotColor: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-600'
  }
};

const MODE_LABELS = {
  chat: 'Chat',
  call: 'Phone Call',
  video: 'Video Call',
  visit: 'Appointment'
};
const token = localStorage.getItem('token');
// ==================== UTILITY FUNCTIONS ====================
const getAuthData = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData),
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error("Error parsing auth data:", error);
  }

  return { token: null, user: null, isAuthenticated: false };
};

const getCurrentPrice = (provider, mode) => {
  if (!provider?.pricing) return 999;

  const priceMap = {
    call: provider.pricing.call?.basePrice,
    video: provider.pricing.video?.basePrice,
    chat: provider.pricing.chat?.basePrice,
    visit: provider.pricing.visit?.basePrice
  };

  return priceMap[mode] || Math.min(
    ...Object.values(priceMap).filter(price => price != null)
  ) || 999;
};

const getMemberSince = (provider) => {
  if (provider?.socialProof?.platformStats?.joinDate) {
    return provider.socialProof.platformStats.joinDate;
  }

  if (provider?.businessInfo?.joinDate) {
    return new Date(provider.businessInfo.joinDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }

  return 'N/A';
};

// ==================== SKELETON COMPONENTS ====================
const SkeletonCard = memo(({ className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
));

const HeaderSkeleton = memo(() => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="flex gap-3">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" style={{ animationDelay: '450ms' }} />
        </div>
      </div>
    </div>
  </div>
));

const LoadingSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HeaderSkeleton />
          <SkeletonCard />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  </div>
));

// ==================== UI COMPONENTS ====================
const LoginPrompt = memo(({ mode, onLoginClick }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
      <p className="text-sm text-gray-600 mb-4">
        Please login to book a {MODE_LABELS[mode] || 'session'} with this provider
      </p>
      <button
        onClick={onLoginClick}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        Login to Continue
      </button>
    </div>
  </div>
));

const StarRating = memo(({ rating = 0, size = "w-3.5 h-3.5" }) => (
  <>
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
      />
    ))}
  </>
));

const ProfileImage = memo(({ provider }) => (
  <div className="flex-shrink-0">
    <div className="relative">
      <div className="flex items-center justify-center text-white text-2xl font-bold">
        {provider.personalInfo.profileImage ? (
          <img
            src={provider.personalInfo.profileImage}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {`${provider.personalInfo.firstName?.[0] || ''}${provider.personalInfo.lastName?.[0] || ''}`}
          </div>
        )}
      </div>
      {provider.professional?.verified && (
        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, value, label, iconColor }) => (
  <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-white-200 p-4 flex items-center gap-3">
    <Icon className={`w-6 h-6 ${iconColor}`} />
    <div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-white mt-1">{label}</div>
    </div>
  </div>
));

const InfoBadge = memo(({ icon: Icon, text, iconColor = "text-blue-600" }) => (
  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
    <span className="text-gray-900">{text}</span>
  </div>
));

// ==================== BOOKING BUTTON COMPONENT ====================
const BookingButton = memo(({
  onClick,
  disabled,
  loading,
  walletCheckLoading,
  hasEnoughBalance,
  modeConfig,
  label
}) => {
  const ModeIcon = modeConfig.icon;

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      );
    }

    if (walletCheckLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Sign For Booking
        </>
      );
    }

    if (hasEnoughBalance) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Book Now
        </>
      );
    }

    if (!hasEnoughBalance) {
      return <>Insufficient Balance</>;
    }

    return (
      <>
        <ModeIcon className="w-4 h-4" />
        {label}
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2 
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed opacity-60'
          : `${modeConfig.buttonClass} hover:shadow-lg transform hover:-translate-y-0.5`
        }`}
    >
      {getButtonContent()}
    </button>
  );
});

// ==================== CUSTOM HOOKS ====================
const useAuth = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userData: null,
    userRole: 'user',
    loading: true
  });

  useEffect(() => {
    const { isAuthenticated, user } = getAuthData();

    setAuthState({
      isLoggedIn: isAuthenticated,
      userData: user,
      userRole: user?.role || 'user',
      loading: false
    });
  }, []);

  return authState;
};

const useProviderData = (providerId, navigate) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const providerData = await getFullProviderData(providerId);

        if (isMounted) {
          if (providerData?.data) {
            setProvider(providerData.data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
        if (isMounted) navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [providerId, navigate]);

  return { provider, loading };
};

const useCallManager = (provider, userData, userRole, providerId, navigate, isLoggedIn) => {
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const initiateCall = useCallback(async (mode, routeSuffix) => {
    if (!isLoggedIn) return false;

    try {
      setBookingInProgress(true);
      const channelName = `call_${providerId}_${Date.now()}`;
      const token = localStorage.getItem('token');

      const tokenResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/agora/call-tokens`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { channel: channelName }
        }
      );

      const { rtcToken, uid, appId } = tokenResponse.data;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/notifications/notify-call`,
        {
          providerId,
          channelName,
          callerName: userData?.name || userData?.email || 'User',
          mode,
          callType: 'instant'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const priceKey = mode === 'audio' ? 'call' : mode;

      const callData = {
        channelName,
        token: rtcToken,
        uid,
        appId,
        providerId,
        providerRate: provider?.pricing || 0,
        //  providerRate: provider?.pricing?.[priceKey]?.basePrice || 0,
        providerName: provider?.personalInfo?.fullName || 'Provider',
        userId: userData?.id,
        userName: userData?.name || userData?.email || 'User',
        userRole,
        mode,
        startTime: new Date().toISOString(),
        status: 'waiting_for_provider'
      };

      navigate(`/call/${channelName}/${routeSuffix}`, {
        state: {
          callData,
          participantName: provider?.personalInfo?.fullName || 'Provider',
          isWaitingForProvider: true,
          providerId
        }
      });

      return true;
    } catch (error) {
      console.error(`Failed to start ${mode}:`, error);
      alert(`Failed to start ${mode}. Please try again.`);
      return false;
    } finally {
      setBookingInProgress(false);
    }
  }, [provider, userData, userRole, providerId, navigate, isLoggedIn]);

  const handleDirectChat = useCallback(() =>
    initiateCall('chat', 'chat'),
    [initiateCall]
  );

  const handleDirectVideoCall = useCallback(() =>
    initiateCall('video', 'video'),
    [initiateCall]
  );

  const handleDirectAudioCall = useCallback(() =>
    initiateCall('audio', 'audio'),
    [initiateCall]
  );

  return {
    bookingInProgress,
    handleDirectChat,
    handleDirectVideoCall,
    handleDirectAudioCall
  };
};


// Fields you want to show in fixed sequence
const sequence = [
  "age",
  "gender",
  "religion",
  "bornCity",
  "nationality",
  "school",
  "collage",
  "qualification",
  "languages",
  "persionality",
  "communicationStyle",
  "hobbies",
  "futureGoals",
];

// Labels formatting
const labelFormat = {
  age: "Age",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  nationality: "Nationality",
  martialStatus: "Marital Status",
  qualification: "Qualification",
  school: "School",
  collage: "College",
  hobbies: "Hobbies",
  futureGoals: "Future Goals",
  fathershometown: "Father's Hometown",
  mothershometown: "Mother's Hometown",
  religion: "Religion",
  bornCity: "Born City",
  languages: "Languages Known",
  passinateAbout: "Passinate About",
  communicationStyle: "Communication Style",
  persionality: "Personality"
};


// ==================== SECTION COMPONENTS ====================
const ProviderHeader = memo(({ provider }) => (
  <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 overflow-hidden">

    {/* ================== TOP BANNER ================== */}
    <div className="relative w-full h-60 md:h-72">
      <img
        src={BannerImage}
        alt="Theme Banner"
        className="w-full h-full object-cover"
      />

      {/* Floating Profile Image */}
      <div className="absolute left-6 bottom-[-35px] md:left-6">
        <div className="w-28 h-28 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <ProfileImage provider={provider} />
        </div>
      </div>
    </div>

    {/* ================== BODY SECTION ================== */}
    <div className="pt-14 px-6 pb-6 md:px-10">

      {/* ===== NAME + RIGHT SIDE INFO ===== */}
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {provider.personalInfo?.fullName || "Provider Name"}
          </h1>
          <p className="text-white text-sm font-medium mt-0.5">
            {provider.services?.primary || "Service Provider"}
          </p>

          <p className="text-white text-sm font-medium mt-1">
            {provider.services?.category || "General Services"}
          </p>

          {/* ===== PROFESSIONAL KEY-VALUE LIST ===== */}
          <div className="mt-4 space-y-3">
            {sequence.map((key) => {
              const value = provider.personalInfo?.[key];
              if (!value) return null; // skip empty values

              // format value
              const formattedValue =
                typeof value === "string" && value.includes("T00:00:00.000Z")
                  ? value.split("T")[0]
                  : value;

              const label = labelFormat[key] || key;

              return (
                <div
                  key={key}
                  className="grid grid-cols-[150px_20px_1fr] text-sm items-start"
                >
                  <span className="font-semibold text-white">{label}</span>
                  <span className="text-white text-center">:</span>
                  <span className="text-white">{formattedValue}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== RIGHT SIDE: VERIFIED + LOCATION + RATING ===== */}
        <div className="flex flex-col items-end gap-3 min-w-[200px]">

          {/* Verified Badge */}
          {provider.professional?.verified && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          {/* Rating Section */}
          <div className="flex flex-col items-start gap-2">
            {/* Rating Badge */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
              <span className="ml-1 font-bold text-white text-sm">
                {provider.ratings?.overall || 0}
              </span>
              <StarRating rating={provider.ratings?.overall || 0} />
            </div>

            {/* Reviews Count */}
            <span className="text-sm text-white whitespace-nowrap">
              {provider.ratings?.totalReviews || 0} reviews
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
));

const StatsGrid = memo(({ provider }) => (
  <div className="grid grid-cols-3 gap-4">
    <StatCard
      icon={TrendingUp}
      value={provider.portfolio?.completedSessions || 0}
      label="Sessions"
      iconColor="text-green-600"
    />
    {/* <StatCard
      icon={Heart}
      value={provider.portfolio?.repeatCustomers || 0}
      label="Repeat"
      iconColor="text-red-600"
    />
    <StatCard
      icon={ThumbsUp}
      value={`${provider.portfolio?.successRate || 0}%`}
      label="Success"
      iconColor="text-blue-600"
    /> */}
  </div>
));

const AboutSection = memo(({ provider }) => {
  if (!provider.personalInfo?.bio) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        About
      </h2>
      <p className="text-sm text-white leading-relaxed">
        {provider.personalInfo.bio}
      </p>

      {provider.services?.secondary?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-white mb-2">Also offers:</p>
          <div className="flex flex-wrap gap-2">
            {provider.services.secondary.map((service, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-white text-gray-900 rounded-md"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// const SpecializationsSection = memo(({ specializations }) => {
//   if (!specializations?.length) return null;

//   return (
//     <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
//       <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
//         <Award className="w-5 h-5 text-white" />
//         Specializations
//       </h2>
//       <div className="grid sm:grid-cols-2 gap-2.5">
//         {specializations.map((spec, idx) => (
//           <div key={idx} className="flex items-start gap-2 p-2.5 bg-white rounded-lg">
//             <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
//             <span className="text-xs text-gray-900 leading-snug">{spec}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

// const EducationSection = memo(({ qualifications }) => {
//   if (!qualifications?.length) return null;

//   return (
//     <div className="bg-[#F0F0F0] rounded-xl border border-gray-200 p-6">
//       <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//         <BookOpen className="w-5 h-5 text-orange-600" />
//         Education
//       </h2>
//       <div className="space-y-3">
//         {qualifications.map((qual, idx) => (
//           <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
//             <div className="font-semibold text-sm text-gray-900 mb-1">
//               {qual.degree || qual.certification || 'Qualification'}
//             </div>
//             <div className="text-xs text-gray-900">
//               {qual.institution || 'N/A'} • {qual.year || 'N/A'}
//             </div>
//             {qual.specialization && (
//               <div className="text-xs text-blue-600 font-medium mt-1">
//                 {qual.specialization}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

const VerificationSection = memo(() => {
  const verification = {
    idVerified: "yes",
    policeVerified: "yes",
    psychometricTest: "Passed",
    behaviourInterview: "Passed",
    trainedbyGetCompanion: "Trained by GetCompanion Training Team"
  };

  if (!verification || Object.keys(verification).length === 0) return null;

  const labelFormat = {
    idVerified: "ID Verification",
    policeVerified: "Police Verification",
    psychometricTest: "Psychometric Test",
    behaviourInterview: "Behavioural Interview",
    trainedbyGetCompanion: "Training By GetCompanion Team",
  };

  const sequence = [
    "idVerified",
    "policeVerified",
    "psychometricTest",
    "behaviourInterview",
    "trainedbyGetCompanion",
  ];

  // STATUS LOGIC
  const statusText = (key, value) => {
    const v = value.toLowerCase();

    // Trained (special case for last item)
    if (key === "trainedbyGetCompanion" && v.includes("trained")) {
      return "Trained";
    }

    // Verified statuses
    if (v === "yes" || v === "verified") return "Verified";

    // Cleared statuses
    if (v === "passed" || v === "cleared") return "Cleared";

    return "Pending";
  };

  const hasGreenTick = (value) => {
    const v = value.toLowerCase();
    return (
      v === "yes" ||
      v === "verified" ||
      v === "passed" ||
      v === "cleared" ||
      v.includes("trained")
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white rounded-xl border border-green-600 p-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-white" />
        GC Verification
      </h2>

      <div className="space-y-3">
        {sequence.map((key) => {
          const value = verification[key];
          if (!value) return null;

          const status = statusText(key, value);
          const verified = hasGreenTick(value);

          return (
            <div
              key={key}
              className="grid grid-cols-3 items-center px-4 py-3 bg-white rounded-lg border border-gray-300"
            >
              {/* 1. Label */}
              <span className="text-black text-sm font-semibold">
                {labelFormat[key]}
              </span>

              {/* 2. Status */}
              <span
                className={`text-sm font-semibold ${verified ? "text-green-700" : "text-white"
                  }`}
              >
                {status}
              </span>

              {/* 3. Tick */}
              <div className="flex justify-end">
                {verified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-white opacity-50" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const ReviewsSection = memo(({ testimonials }) => {
  if (!testimonials?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-green-600" />
        Reviews ({testimonials.length})
      </h2>
      <div className="space-y-3">
        {testimonials.map((review, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {review.client?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {review.client || 'Anonymous'}
                  </span>
                  {review.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <StarRating rating={review.rating || 0} />
                  </div>
                  <span className="text-xs text-gray-500">{review.date || 'N/A'}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-900 leading-relaxed">
              {review.comment || 'No comment provided.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

const AchievementsSection = memo(({ achievements }) => {
  if (!achievements?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-600" />
        Achievements
      </h2>
      <div className="space-y-2">
        {achievements.map((achievement, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2.5 bg-white rounded-lg">
            <Award className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-gray-900">{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

const BookingCard = memo(({
  isLoggedIn,
  mode,
  modeConfig,
  currentPrice,
  userData,
  onBalanceChecked,
  onBookingAction,
  isBookingDisabled,
  bookingInProgress,
  walletCheckLoading,
  hasEnoughBalance,
  provider,
  onLoginClick
}) => {
  if (!isLoggedIn) {
    return <LoginPrompt mode={mode} onLoginClick={onLoginClick} />;
  }

  const ModeIcon = modeConfig.icon;

  return (
    <div className="rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  backdrop-blur-sm p-6">
        {/* Mode Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg">
            <ModeIcon className={`w-5 h-5 ${modeConfig.textColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white">{modeConfig.label}</h3>
            <p className="text-xs text-white">Book your session</p>
          </div>
        </div>

        {/* Price Display */}
        <div className="p-4 bg-white rounded-xl border mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs text-gray-600 mb-1">Session Price</div>
              <div className={`text-3xl font-bold ${modeConfig.textColor}`}>
                ₹{currentPrice}
                {(mode === 'call' || mode === 'video' || mode === 'chat') && (
                  <span className="text-sm font-medium text-gray-500 ml-1">/min</span>
                )}
              </div>
            </div>
            <div
              className={`px-3 py-1 bg-white text-gray-900 ${modeConfig.borderColor} border rounded-full text-xs font-semibold uppercase`}
            >
              {mode}
            </div>
          </div>
        </div>

        {/* Wallet Check */}
        <div className="my-2">
          <WalletCheck
            userId={userData?.id || "USER-001"}
            servicePrice={currentPrice}
            onBalanceChecked={onBalanceChecked}
            mode={mode}
          />
        </div>

        {/* Book Button */}
        <BookingButton
          onClick={onBookingAction}
          disabled={isBookingDisabled}
          loading={bookingInProgress}
          walletCheckLoading={walletCheckLoading}
          hasEnoughBalance={hasEnoughBalance}
          modeConfig={modeConfig}
          label={modeConfig.buttonText}
        />
      </div>
    </div>
  );
});

const LanguagesCard = memo(({ languages }) => {
  if (!languages?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
        <Globe className="w-4 h-4 text-white" />
        Languages
      </h3>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-gray-[#F0F0F0] text-cyan-700 border border-cyan-200 rounded-lg text-xs font-medium"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
});

const EquipmentCard = memo(({ equipment }) => {
  if (!equipment?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-orange-600" />
        Equipment
      </h3>
      <div className="space-y-2">
        {equipment.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-900 p-2 bg-white rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

const ServiceAreasCard = memo(({ serviceAreas }) => {
  if (!serviceAreas?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-indigo-600" />
        Service Areas
      </h3>
      <div className="flex flex-wrap gap-2">
        {serviceAreas.map((area, idx) => (
          <span
            key={idx}
            className="text-xs px-2.5 py-1 bg-white text-gray-900 rounded-lg"
          >
            {area}
          </span>
        ))}
      </div>
    </div>
  );
});

const TrustBadgeCard = memo(({ provider, memberSince }) => (
  <div className="bg-gradient-to-br from-[#0B1A47] via-[#672255] to-[#B34C44] text-white  rounded-xl border border-gray-200 p-6">
    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
      <Shield className="w-4 h-4 text-purple-600" />
      Trust & Safety
    </h3>
    {provider.professional?.verificationDocuments?.length > 0 ? (
      <div className="space-y-2">
        {provider.professional.verificationDocuments.map((doc, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-900 p-2 bg-white rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>{doc} Verified</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center gap-2 text-xs text-gray-900 p-2 bg-white rounded-lg">
        <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
        <span>GC Verified</span>
      </div>
    )}
    <div className="mt-4 pt-4 border-t border-white">
      <p className="text-xs text-gray-600">Member since {memberSince}</p>
    </div>
  </div>
));

const MobileBottomBar = memo(({
  modeConfig,
  currentPrice,
  mode,
  provider,
  onBookingAction,
  isBookingDisabled,
  bookingInProgress,
  walletCheckLoading,
  hasEnoughBalance,
  isLoggedIn
}) => {
  const ModeIcon = modeConfig.icon;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="px-4 py-3">
        {/* Mode Indicator */}
        <div className={`flex items-center gap-2 mb-2 px-3 py-1.5 ${modeConfig.bgColor} ${modeConfig.borderColor} border rounded-lg`}>
          <ModeIcon className={`w-4 h-4 ${modeConfig.textColor}`} />
          <span className={`text-xs font-semibold ${modeConfig.textColor}`}>
            {modeConfig.label}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 ${modeConfig.dotColor} rounded-full animate-pulse`} />
            <span className={`text-xs ${modeConfig.textColor}`}>
              {provider.availability?.status === 'available' ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="text-xs text-gray-600">From</div>
            <div className={`text-xl font-bold ${modeConfig.textColor}`}>
              ₹{currentPrice}
              {(mode === 'call' || mode === 'video' || mode === 'chat') && (
                <span className="text-sm font-medium text-gray-500 ml-1">/min</span>
              )}
            </div>
          </div>
          <button
            onClick={onBookingAction}
            disabled={isBookingDisabled}
            className={`flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2 
              ${isBookingDisabled
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : `${modeConfig.buttonClass} active:scale-95`
              }`}
          >
            {bookingInProgress ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) 
            : walletCheckLoading && !token ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            )
            : walletCheckLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : !hasEnoughBalance && token ? (
              <>Low Balance</>
            ) : (
              <>
                <ModeIcon className="w-4 h-4" />
                {!isLoggedIn ? 'Login' : modeConfig.buttonText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

// ==================== MAIN COMPONENT ====================
const ProviderDetailsPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const mode = searchParams.get('mode') || 'visit';

  // State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [walletCheckLoading, setWalletCheckLoading] = useState(false);

  // Custom hooks
  const { isLoggedIn, userData, userRole } = useAuth();
  const { provider, loading } = useProviderData(providerId, navigate);
  const {
    bookingInProgress,
    handleDirectChat,
    handleDirectVideoCall,
    handleDirectAudioCall
  } = useCallManager(provider, userData, userRole, providerId, navigate, isLoggedIn);

  // Memoized values
  const modeConfig = useMemo(() => MODE_CONFIGS[mode] || MODE_CONFIGS.visit, [mode]);
  const currentPrice = useMemo(() => getCurrentPrice(provider, mode), [provider, mode]);
  const memberSince = useMemo(() => getMemberSince(provider), [provider]);

  const isBookingDisabled = useMemo(() => {
    if (!isLoggedIn) return false;
    return walletCheckLoading || bookingInProgress || !hasEnoughBalance;
  }, [isLoggedIn, walletCheckLoading, bookingInProgress, hasEnoughBalance]);

  // Callbacks
  const handleBalanceChecked = useCallback((isEnough) => {
    setHasEnoughBalance(isEnough);
    setWalletCheckLoading(false);
  }, []);

  useEffect(() => {
    if (location.state?.autoRetryCall && provider) {
      const callType = location.state?.callType;

      // Auto-trigger the appropriate call type
      if (callType === 'chat') {
        handleDirectChat();
      } else if (callType === 'audio') {
        handleDirectAudioCall();
      } else if (callType === 'video') {
        handleDirectVideoCall();
      }

      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, provider]);

  const handleLoginRedirect = useCallback(() => {
    navigate('/auth/login', {
      state: { returnUrl: window.location.pathname + window.location.search }
    });
  }, [navigate]);

  const handleBookingAction = useCallback(() => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }

    if (walletCheckLoading) return;

    if (!hasEnoughBalance) {
      const modeLabel = MODE_LABELS[mode] || 'session';
      alert(`You do not have enough balance to start a ${modeLabel.toLowerCase()}. Please recharge and try again.`);
      return;
    }

    const actionMap = {
      call: handleDirectAudioCall,
      video: handleDirectVideoCall,
      chat: handleDirectChat,
      visit: () => setShowBookingModal(true)
    };

    const action = actionMap[mode] || actionMap.visit;
    action();
  }, [
    isLoggedIn,
    walletCheckLoading,
    hasEnoughBalance,
    mode,
    handleLoginRedirect,
    handleDirectAudioCall,
    handleDirectVideoCall,
    handleDirectChat
  ]);

  // Loading state
  if (loading) return <LoadingSkeleton />;
  if (!provider) return null;

  return (
    <>
      <Helmet>
        <title>Meet Your Happiness Executive | Provider Details</title>
        <meta name="description" content="View detailed profiles including experience, emotional skills, ratings and available communication modes." />
        <meta name="keywords" content="companion details India, emotional guide profile, verified companion India" />

        <meta property="og:title" content="Provider Profile" />
        <meta property="og:description" content="Real conversations, emotional support and meaningful companionship from verified Happiness Executives — anytime you need someone to talk to." />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ProviderHeader provider={provider} />
              <StatsGrid provider={provider} />
              <AboutSection provider={provider} />
              {/* <SpecializationsSection specializations={provider.professional?.specializations} /> */}
              <VerificationSection verification={provider.Verification} />
              <ReviewsSection testimonials={provider.portfolio?.testimonials} />
              <AchievementsSection achievements={provider.portfolio?.achievements} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <BookingCard
                isLoggedIn={isLoggedIn}
                mode={mode}
                modeConfig={modeConfig}
                currentPrice={currentPrice}
                userData={userData}
                onBalanceChecked={handleBalanceChecked}
                onBookingAction={handleBookingAction}
                isBookingDisabled={isBookingDisabled}
                bookingInProgress={bookingInProgress}
                walletCheckLoading={walletCheckLoading}
                hasEnoughBalance={hasEnoughBalance}
                provider={provider}
                onLoginClick={handleLoginRedirect}
              />
              <LanguagesCard languages={provider.professional?.languages} />
              {/* <EquipmentCard equipment={provider.businessInfo?.equipment} /> */}
              <ServiceAreasCard serviceAreas={provider.businessInfo?.serviceAreas} />
              <TrustBadgeCard provider={provider} memberSince={memberSince} />
            </div>
          </div>
        </main>

        {/* Mobile Bottom Bar */}
        <MobileBottomBar
          modeConfig={modeConfig}
          currentPrice={currentPrice}
          mode={mode}
          provider={provider}
          onBookingAction={handleBookingAction}
          isBookingDisabled={isBookingDisabled}
          bookingInProgress={bookingInProgress}
          walletCheckLoading={walletCheckLoading}
          hasEnoughBalance={hasEnoughBalance}
          isLoggedIn={isLoggedIn}
        />

        {/* Booking Modal */}
        {isLoggedIn && (
          <BookingModal
            provider={provider}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProviderDetailsPage;