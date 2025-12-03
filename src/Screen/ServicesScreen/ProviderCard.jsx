// import { memo, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Star,
//   Phone,
//   Video,
//   MapPin,
//   CheckCircle,
//   MessageCircle,
//   Bookmark
// } from "lucide-react";

// import BannerImage from "../../Logos/bannerImage.png";
// import { usePresence } from "../../context/UserStatusContext";   // ✅ NEW

// // ==================== CONSTANTS ====================
// const STATUS_COLORS = {
//   online: "bg-green-500",
//   recently_active: "bg-orange-400",
//   busy: "bg-red-500",
//   offline: "bg-gray-400"
// };

// const MODE_CONFIGS = {
//   call: {
//     buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
//     activeText: "Start Call",
//     unavailableText: "Call Unavailable"
//   },
//   video: {
//     buttonClass: "bg-[#1A1A1A]  hover:bg-green-700",
//     activeText: "Start Video Call",
//     unavailableText: "Video Unavailable"
//   },
//   chat: {
//     buttonClass: "bg-[#1A1A1A]  hover:bg-green-700",
//     activeText: "Start Chat",
//     unavailableText: "Chat Unavailable"
//   },
//   visit: {
//     buttonClass: "bg-[#1A1A1A]  hover:bg-green-700",
//     activeText: "View & Book",
//     unavailableText: "Currently Busy"
//   }
// };

// const PRICE_STYLES = {
//   call: "bg-[#E5F0FF] text-black-700",
//   video: "bg-[#FEDDED] text-black-700",
//   chat: "bg-[#FFF6CC] text-black-700",
//   visit: "bg-[#FFE3CC] text-black-700"
// };

// // ==================== UTILITY FUNCTIONS ====================
// const getProviderStatus = (provider) => {
//   const status =
//     provider.presence?.availabilityStatus ||
//     (provider.presence?.isOnline ? "online" : "offline");

//   const isAvailable = status === "online";
//   const statusColor = STATUS_COLORS[status] || STATUS_COLORS.offline;

//   return { status, isAvailable, statusColor };
// };

// const getInitials = (firstName = "", lastName = "") =>
//   `${firstName[0] || ""}${lastName[0] || ""}`;

// const formatStatus = (status) => status.replace("_", " ");

// // ==================== SUB-COMPONENTS ====================
// const ProviderImage = memo(({ provider }) => {
//   const initials = useMemo(
//     () => getInitials(provider.personalInfo.firstName, provider.personalInfo.lastName),
//     [provider.personalInfo.firstName, provider.personalInfo.lastName]
//   );

//   if (provider.personalInfo.profileImage) {
//     return (
//       <img
//         src={provider.personalInfo.profileImage}
//         alt="Profile"
//         className="h-16 w-16 rounded-full object-cover"
//         loading="lazy"
//       />
//     );
//   }

//   return (
//     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
//       {initials}
//     </div>
//   );
// });

// const StatusBadge = memo(({ status, statusColor }) => (
//   <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-black/40 text-white backdrop-blur-sm">
//     <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
//     <span className="capitalize">{formatStatus(status)}</span>
//   </div>
// ));

// const VerificationBadge = memo(({ verified }) => {
//   if (!verified) return null;

//   return (
//     <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
//       <CheckCircle className="w-3.5 h-3.5" />
//       Verified
//     </span>
//   );
// });

// const ProviderInfo = memo(({ provider }) => (
//   <div className="flex flex-col gap-1 mt-2">
//     <div className="flex items-center justify-between gap-2">
//       <div className="min-w-0">
//         <h3 className="text-base font-semibold text-gray-900 truncate">
//           {provider.personalInfo?.fullName || "Provider"}
//         </h3>
//         <p className="text-xs text-gray-600 truncate">
//           {provider.services?.primary || "Companion"}
//         </p>
//       </div>
//       <button
//         type="button"
//         className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Bookmark className="w-4 h-4 text-gray-500" />
//       </button>
//     </div>
//     <VerificationBadge verified={provider.professional?.verified} />
//   </div>
// ));

// const TagList = memo(({ provider }) => {
//   const tags = provider.services?.secondary || [];
//   if (!tags.length) return null;

//   const visible = tags.slice(0, 3);
//   const remaining = tags.length - visible.length;

//   return (
//     <div className="flex flex-wrap gap-2 mt-3">
//       {visible.map((tag) => (
//         <span
//           key={tag}
//           className="px-3 py-1 rounded-full bg-gray-100 text-[11px] text-gray-700"
//         >
//           {tag}
//         </span>
//       ))}
//       {remaining > 0 && (
//         <span className="px-3 py-1 rounded-full bg-gray-100 text-[11px] text-gray-700">
//           +{remaining} more
//         </span>
//       )}
//     </div>
//   );
// });

// const QuickStats = memo(({ provider }) => (
//   <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
//     <span className="flex items-center gap-1">
//       <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
//       <span className="font-semibold">
//         {provider.ratings?.overall?.toFixed(1) || 0}
//       </span>
//       <span className="text-gray-400">
//         ({provider.ratings?.totalReviews || 0})
//       </span>
//     </span>
//     <span>{provider.professional?.experience || 0} yrs+</span>
//     <span className="flex items-center gap-1">
//       <MapPin className="w-3.5 h-3.5 text-gray-400" />
//       {provider.address?.city || "N/A"}
//     </span>
//   </div>
// ));

// const PriceItem = memo(({ icon: Icon, price, variant }) => {
//   const style = PRICE_STYLES[variant] || "bg-gray-50 text-gray-700";

//   return (
//     <div className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl ${style}`}>
//       <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
//         <Icon className="w-4 h-4" />
//       </div>
//       <span className="text-xs font-medium">₹{price ?? "-"}</span>
//     </div>
//   );
// });

// const PricingRow = memo(({ provider }) => (
//   <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
//     <PriceItem icon={Phone} price={provider.pricing?.call?.basePrice} variant="call" />
//     <PriceItem icon={Video} price={provider.pricing?.video?.basePrice} variant="video" />
//     <PriceItem icon={MessageCircle} price={provider.pricing?.chat?.basePrice} variant="chat" />
//     <PriceItem icon={MapPin} price={provider.pricing?.visit?.basePrice} variant="visit" />
//   </div>
// ));

// const ActionButton = memo(({ onClick, isAvailable, mode, status }) => {
//   const config = MODE_CONFIGS[mode] || MODE_CONFIGS.visit;

//   const buttonText = useMemo(() => {
//     if (isAvailable) return config.activeText;
//     if (mode !== "visit") return config.unavailableText;
//     return status === "recently_active" ? "Recently Active" : "Currently Busy";
//   }, [isAvailable, mode, status, config]);

//   const buttonClass = useMemo(() => {
//     if (isAvailable) {
//       return `${config.buttonClass} text-white`;
//     }
//     return "bg-gray-200 text-gray-500 cursor-not-allowed";
//   }, [isAvailable, config]);

//   return (
//     <button
//       onClick={onClick}
//       disabled={!isAvailable}
//       className={`w-full mt-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${buttonClass}`}
//     >
//       {buttonText}
//     </button>
//   );
// });

// // ==================== MAIN COMPONENT ====================
// const ProviderCard = ({ provider, mode = "visit" }) => {
//   const navigate = useNavigate();

//   const { presenceMap } = usePresence(); // ✅ NEW real-time data

//   // ==============================
//   // 🔥 REAL-TIME STATUS MERGING
//   // ==============================
//   const { status, isAvailable, statusColor } = useMemo(() => {
//     const livePresence = presenceMap[provider._id];

//     const mergedProvider = {
//       ...provider,
//       presence: livePresence
//         ? {
//           ...provider.presence,
//           isOnline: livePresence.isOnline,
//           availabilityStatus: livePresence.status,
//         }
//         : provider.presence,
//     };

//     return getProviderStatus(mergedProvider);
//   }, [provider, presenceMap]);

//   const handleCardClick = useCallback(() => {
//     navigate(`/provider/${provider._id}?mode=${mode}`);
//   }, [provider._id, mode, navigate]);

//   const handleBookNow = useCallback(
//     (e) => {
//       e.stopPropagation();
//       navigate(`/provider/${provider._id}?mode=${mode}&action=book`);
//     },
//     [provider._id, mode, navigate]
//   );

//   const bannerImage = BannerImage;

//   return (
//     <div
//       onClick={handleCardClick}
//       className="group bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
//     >
//       {/* Top Banner */}
//       <div className="relative h-full w-full">
//         {bannerImage ? (
//           <img
//             src={bannerImage}
//             alt="Banner"
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300" />
//         )}

//         {/* Status badge in banner */}
//         <div className="absolute top-3 right-3">
//           <StatusBadge status={status} statusColor={statusColor} />
//         </div>

//         {/* Avatar */}
//         <div className="absolute -bottom-8 left-4 rounded-full ring-4 ring-white">
//           <ProviderImage provider={provider} />
//         </div>
//       </div>

//       {/* Card Body */}
//       <div className="pt-10 pb-4 px-4 sm:px-5">
//         <ProviderInfo provider={provider} />
//         <TagList provider={provider} />
//         <QuickStats provider={provider} />
//         <PricingRow provider={provider} />
//         <ActionButton
//           onClick={handleBookNow}
//           isAvailable={isAvailable}
//           mode={mode}
//           status={status}
//         />
//       </div>
//     </div>
//   );
// };

// export default memo(ProviderCard);


// import { memo, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Star,
//   Phone,
//   Video,
//   MapPin,
//   CheckCircle,
//   MessageCircle,
//   Bookmark
// } from "lucide-react";

// import BannerImage from "../../Logos/bannerImage.png";
// import { usePresence } from "../../context/UserStatusContext";

// // ==================== CONSTANTS ====================
// const STATUS_COLORS = {
//   online: "bg-green-500",
//   recently_active: "bg-orange-400",
//   busy: "bg-red-500",
//   offline: "bg-gray-400"
// };

// const MODE_CONFIGS = {
//   call: {
//     buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
//     activeText: "Start Call",
//     unavailableText: "Call Unavailable"
//   },
//   video: {
//     buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
//     activeText: "Start Video Call",
//     unavailableText: "Video Unavailable"
//   },
//   chat: {
//     buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
//     activeText: "Start Chat",
//     unavailableText: "Chat Unavailable"
//   },
//   visit: {
//     buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
//     activeText: "View & Book",
//     unavailableText: "Currently Busy"
//   }
// };

// const PRICE_STYLES = {
//   call: "bg-[#E5F0FF] text-black-700",
//   video: "bg-[#FEDDED] text-black-700",
//   chat: "bg-[#FFF6CC] text-black-700",
//   visit: "bg-[#FFE3CC] text-black-700"
// };

// // ==================== UTILITY ====================
// const getProviderStatus = (provider) => {
//   const status = provider.presence?.isOnline ? "online" : "offline";
//   return {
//     status,
//     isAvailable: status === "offine",
//     statusColor: STATUS_COLORS.offline
//   };
// };

// const getInitials = (firstName = "", lastName = "") =>
//   `${firstName[0] || ""}${lastName[0] || ""}`;

// const formatStatus = (status) => status.replace("_", " ");

// // ==================== SUB-COMPONENTS ====================
// const ProviderImage = memo(({ provider }) => {
//   const initials = useMemo(
//     () =>
//       getInitials(
//         provider.personalInfo.firstName,
//         provider.personalInfo.lastName
//       ),
//     [provider.personalInfo.firstName, provider.personalInfo.lastName]
//   );

//   if (provider.personalInfo.profileImage) {
//     return (
//       <img
//         src={provider.personalInfo.profileImage}
//         alt="Profile"
//         className="h-16 w-16 rounded-full object-cover"
//       />
//     );
//   }

//   return (
//     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
//       {initials}
//     </div>
//   );
// });

// const StatusBadge = memo(({ status, statusColor }) => (
//   <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white">
//     <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
//     <span className="capitalize">{formatStatus(status)}</span>
//   </div>
// ));

// const VerificationBadge = memo(({ verified }) => {
//   if (!verified) return null;
//   return (
//     <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
//       <CheckCircle className="w-3.5 h-3.5" />
//       Verified
//     </span>
//   );
// });

// const ProviderInfo = memo(({ provider }) => (
//   <div className="flex flex-col gap-1 mt-2">
//     <div className="flex items-center justify-between">
//       <div className="min-w-0">
//         <h3 className="text-base font-semibold text-gray-900 truncate">
//           {provider.personalInfo?.fullName}
//         </h3>
//         <p className="text-xs text-gray-600 truncate">
//           {provider.services?.primary}
//         </p>
//       </div>
//       <button
//         className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Bookmark className="w-4 h-4 text-gray-500" />
//       </button>
//     </div>

//     <VerificationBadge verified={provider.professional?.verified} />
//   </div>
// ));

// const TagList = memo(({ provider }) => {
//   const tags = provider.services?.secondary || [];
//   if (!tags.length) return null;

//   return (
//     <div className="flex flex-wrap gap-2 mt-3">
//       {tags.slice(0, 3).map((tag) => (
//         <span key={tag} className="px-3 py-1 bg-gray-100 text-[11px] rounded-full">
//           {tag}
//         </span>
//       ))}

//       {tags.length > 3 && (
//         <span className="px-3 py-1 bg-gray-100 text-[11px] rounded-full">
//           +{tags.length - 3} more
//         </span>
//       )}
//     </div>
//   );
// });

// const QuickStats = memo(({ provider }) => (
//   <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
//     <span className="flex items-center gap-1">
//       <Star className="w-3.5 h-3.5 text-yellow-400" />
//       <span className="font-semibold">
//         {provider.ratings?.overall?.toFixed(1) || 0}
//       </span>
//       <span className="text-gray-400">
//         ({provider.ratings?.totalReviews || 0})
//       </span>
//     </span>

//     <span>{provider.professional?.experience || 0} yrs+</span>

//     <span className="flex items-center gap-1">
//       <MapPin className="w-3.5 h-3.5 text-gray-400" />
//       {provider.address?.city}
//     </span>
//   </div>
// ));

// // ==================== PRICE ITEM (Hide invalid modes) ====================
// const PriceItem = memo(({ icon: Icon, price, variant }) => {
//   if (
//     price === 0 ||
//     price === undefined ||
//     price === null ||
//     price === "" ||
//     Number(price) === 0
//   ) {
//     return null;
//   }

//   const style = PRICE_STYLES[variant];

//   return (
//     <div className={`flex-1 flex flex-col items-center px-2 py-2 rounded-xl ${style}`}>
//       <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
//         <Icon className="w-4 h-4" />
//       </div>
//       <span className="text-xs font-medium">₹{price}</span>
//     </div>
//   );
// });

// // ==================== PRICING ROW ====================
// const PricingRow = memo(({ provider }) => (
//   <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
//     <PriceItem icon={Phone} price={provider.pricing?.call?.basePrice} variant="call" />
//     <PriceItem icon={Video} price={provider.pricing?.video?.basePrice} variant="video" />
//     <PriceItem icon={MessageCircle} price={provider.pricing?.chat?.basePrice} variant="chat" />
//     <PriceItem icon={MapPin} price={provider.pricing?.visit?.basePrice} variant="visit" />
//   </div>
// ));

// // ==================== MAIN COMPONENT ====================
// const ProviderCard = ({ provider, mode = "visit" }) => {
//   const navigate = useNavigate();
//   const { presenceMap } = usePresence();

//   // 🔥 All hooks must run BEFORE any return
//   const { status, isAvailable, statusColor } = useMemo(() => {
//     const live = presenceMap[provider._id];

//     return getProviderStatus(
//       live
//         ? {
//             ...provider,
//             presence: {
//               ...provider.presence,
//               isOnline: live.isOnline,
//               availabilityStatus: live.status
//             }
//           }
//         : provider
//     );
//   }, [provider, presenceMap]);

//   const handleCardClick = () => {
//     navigate(`/provider/${provider._id}?mode=${mode}`);
//   };

//   const handleBookNow = (e) => {
//     e.stopPropagation();
//     navigate(`/provider/${provider._id}?mode=${mode}&action=book`);
//   };

//   // 🚫 SAFE PLACEMENT — now hooks aren't conditional
//   if (mode === "visit" && provider.personalInfo?.gender === "Female") {
//     return null;
//   }

//   return (
//     <div
//       onClick={handleCardClick}
//       className="group bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
//     >
//       {/* Banner */}
//       <div className="relative">
//         <img src={BannerImage} alt="banner" className="w-full h-full object-cover" />
//         <div className="absolute top-3 right-3">
//           <StatusBadge status={status} statusColor={statusColor} />
//         </div>
//         <div className="absolute -bottom-8 left-4 rounded-full ring-4 ring-white">
//           <ProviderImage provider={provider} />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="pt-10 pb-4 px-4">
//         <ProviderInfo provider={provider} />
//         <TagList provider={provider} />
//         <QuickStats provider={provider} />
//         <PricingRow provider={provider} />

//         <button
//           onClick={handleBookNow}
//           disabled={!isAvailable}
//           className={`w-full mt-5 py-2.5 rounded-xl text-sm font-medium ${
//             isAvailable
//               ? `${MODE_CONFIGS[mode].buttonClass} text-white`
//               : "bg-gray-200 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           {isAvailable
//             ? MODE_CONFIGS[mode].activeText
//             : MODE_CONFIGS[mode].unavailableText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default memo(ProviderCard);






import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  MessageCircle,
  Bookmark
} from "lucide-react";

import BannerImage from "../../Logos/bannerImage.png";
import { usePresence } from "../../context/UserStatusContext";

// ======================== CONSTANTS ========================

const STATUS_COLORS = {
  online: "bg-green-500",
  busy: "bg-red-500",
  offline: "bg-gray-400"
};

const MODE_CONFIGS = {
  call: {
    buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
    activeText: "Start Call",
    unavailableText: "Call Unavailable"
  },
  video: {
    buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
    activeText: "Start Video Call",
    unavailableText: "Video Unavailable"
  },
  chat: {
    buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
    activeText: "Start Chat",
    unavailableText: "Chat Unavailable"
  },
  visit: {
    buttonClass: "bg-[#1A1A1A] hover:bg-green-700",
    activeText: "View & Book",
    unavailableText: "Currently Busy"
  }
};

const PRICE_STYLES = {
  call: "bg-[#E5F0FF]",
  video: "bg-[#FEDDED]",
  chat: "bg-[#FFF6CC]",
  visit: "bg-[#FFE3CC]"
};

// ======================== SUB COMPONENTS ========================

const ProviderImage = memo(({ provider }) => {
  const initials = `${provider?.personalInfo?.firstName?.[0] || ""}${provider?.personalInfo?.lastName?.[0] || ""}`.toUpperCase();

  return provider?.personalInfo?.profileImage ? (
    <img
      src={provider.personalInfo.profileImage}
      alt="Profile"
      className="h-16 w-16 rounded-full object-cover"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
      {initials}
    </div>
  );
});

const StatusBadge = memo(({ status, statusColor }) => (
  <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white">
    <span className={`w-2 h-2 rounded-full ${statusColor}`} />
    <span className="capitalize">{status}</span>
  </div>
));

const VerificationBadge = memo(({ verified }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
      <CheckCircle className="w-3.5 h-3.5" />
      Verified
    </span>
  ) : null
);

const PriceItem = memo(({ icon: Icon, price, variant }) => {
  if (!price || Number(price) === 0) return null;

  return (
    <div className={`flex-1 flex flex-col items-center px-2 py-2 rounded-xl ${PRICE_STYLES[variant]}`}>
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium">₹{price}</span>
    </div>
  );
});

// ======================== MAIN CARD ========================

const ProviderCard = ({ provider, mode = "visit" }) => {
  const navigate = useNavigate();
  const { presenceMap } = usePresence();

  // Fetch presence
  const livePresence = presenceMap?.[provider?._id] || provider?.presence || {};
  const hasLivePresence = livePresence?.hasOwnProperty("isOnline");

  const isOnline = livePresence?.isOnline === true;
  const liveStatus = livePresence?.status;

  const apiAvailable = provider?.availability === "Available";

  let finalStatus;

  // ======================== STATUS RULES ========================
  if (hasLivePresence) {
    if (!isOnline) {
      finalStatus = "offline";
    } else {
      // if online, refine by status
      if (liveStatus === "busy") finalStatus = "busy";
      else finalStatus = "online"; // online + available → online
    }
  } else if (apiAvailable) {
    finalStatus = "online"; // API fallback
  } else {
    finalStatus = "offline";
  }

  const statusColor =
    STATUS_COLORS[finalStatus] || STATUS_COLORS.offline;

  const finalOnlineState = finalStatus === "online";

  // Hide female in visit mode
  if (mode === "visit" && provider?.personalInfo?.gender === "Female") {
    return null;
  }

  // ---------------- EVENTS ----------------
  const handleCardClick = () =>
    navigate(`/provider/${provider?._id}?mode=${mode}`);

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/provider/${provider?._id}?mode=${mode}&action=book`);
  };

  const isButtonDisabled = mode === "visit" ? false : !finalOnlineState;

  const buttonText =
    mode === "visit"
      ? MODE_CONFIGS.visit.activeText
      : finalOnlineState
        ? MODE_CONFIGS[mode].activeText
        : MODE_CONFIGS[mode].unavailableText;

  // ---------------- RETURN UI ----------------

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
    >
      {/* BANNER */}
      <div className="relative">
        <img src={BannerImage} alt="banner" className="w-full h-full object-cover" />

        {mode !== "visit" && (
          <div className="absolute top-3 right-3">
            <StatusBadge status={finalStatus} statusColor={statusColor} />
          </div>
        )}

        <div className="absolute -bottom-8 left-4 rounded-full ring-4 ring-white">
          <ProviderImage provider={provider} />
        </div>
      </div>

      {/* BODY */}
      <div className="pt-10 pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {provider?.personalInfo?.fullName || "Unknown Provider"}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {provider?.services?.primary || "Service Not Assigned"}
            </p>
          </div>

          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white shadow-sm border flex items-center justify-center"
          >
            <Bookmark className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <VerificationBadge verified={true} />

        {/* QUICK STATS */}
        <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            {provider?.ratings?.overall?.toFixed?.(1) || "0.0"}
          </span>
          <span>{provider?.professional?.experience || 0} yrs+</span>
        </div>

        {/* PRICING */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
          <PriceItem icon={Phone} price={provider?.pricing?.call?.basePrice} variant="call" />
          <PriceItem icon={Video} price={provider?.pricing?.video?.basePrice} variant="video" />
          <PriceItem icon={MessageCircle} price={provider?.pricing?.chat?.basePrice} variant="chat" />
          <PriceItem icon={MapPin} price={provider?.pricing?.visit?.basePrice} variant="visit" />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleBookNow}
          disabled={isButtonDisabled}
          className={`w-full mt-5 py-2.5 rounded-xl text-sm font-medium ${
            isButtonDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : `${MODE_CONFIGS[mode].buttonClass} text-white`
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default memo(ProviderCard);
