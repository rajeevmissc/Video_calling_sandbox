// import { useState, useEffect, useCallback, useMemo, memo } from 'react';
// import { Phone, Video, MapPin, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
// import ProviderCard from './ProviderCard';

// // ==================== CONSTANTS ====================
// const ITEMS_PER_PAGE = 25;

// const TABS_CONFIG = [
//   { id: 'chat', label: 'Discreet Chat', icon: MessageCircle, filter: 'chat', mode: 'chat' },
//   { id: 'visit', label: 'In-Person Visit', icon: MapPin, filter: 'home-visit', mode: 'visit' },
//   { id: 'call', label: 'Discreet Audio Call', icon: Phone, filter: 'voice-call', mode: 'call' },
//   { id: 'video', label: 'Discreet Video Call', icon: Video, filter: 'video-chat', mode: 'video' },
// ];

// // ==================== UTILITY FUNCTIONS ====================
// const getVisibleTabs = (selectedCommunicationMethods) => {
//   if (!selectedCommunicationMethods) return TABS_CONFIG;

//   if (selectedCommunicationMethods === 'call') {
//     return TABS_CONFIG.filter(tab =>
//       ['voice-call', 'video-chat'].includes(tab.filter)
//     );
//   }

//   return TABS_CONFIG.filter(tab => tab.filter === selectedCommunicationMethods);
// };

// const calculatePagination = (providersCount, currentPage) => {
//   const totalPages = Math.ceil(providersCount / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;

//   return { totalPages, startIndex, endIndex };
// };

// const generatePageNumbers = (totalPages, currentPage) => {
//   const maxVisible = 7;

//   if (totalPages <= maxVisible) {
//     return Array.from({ length: totalPages }, (_, i) => i + 1);
//   }

//   if (currentPage <= 4) {
//     return Array.from({ length: maxVisible }, (_, i) => i + 1);
//   }

//   if (currentPage >= totalPages - 3) {
//     return Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + i + 1);
//   }

//   return Array.from({ length: maxVisible }, (_, i) => currentPage - 3 + i);
// };

// // ==================== SUB-COMPONENTS ====================
// // NOTE: TabButton changed: removed flex-1 (so tabs size to content), improved visual states.
// const TabButton = memo(({ tab, isActive, onClick }) => {
//   const Icon = tab.icon;

//   return (
//     <button
//       onClick={onClick}
//       className={`inline-flex items-center gap-3 px-4 py-2 min-w-[140px] rounded-lg whitespace-nowrap transition-all duration-200
//         ${isActive
//           ? 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 font-semibold'
//           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
//       `}
//       aria-pressed={isActive}
//     >
//       <Icon className={`w-5 h-5 ${isActive ? 'scale-105' : ''} transition-transform`} />
//       <span className="text-sm md:text-base">{tab.label}</span>
//       {isActive && <span className="ml-1 w-2 h-2 rounded-full bg-blue-600 inline-block" />}
//     </button>
//   );
// });

// const EmptyState = memo(({ activeTabData }) => (
//   <div className="flex items-center justify-center h-full min-h-[400px]">
//     <div className="text-center py-12">
//       <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
//         {activeTabData && <activeTabData.icon className="w-10 h-10 text-gray-400" />}
//       </div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">No providers found</h3>
//       <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
//     </div>
//   </div>
// ));

// const ProviderGrid = memo(({ providers, activeTab, mode }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//     {providers.map((provider, index) => (
//       <div
//         key={`${activeTab}-${provider._id}`}
//         className="opacity-0"
//         style={{
//           animation: `fadeInUp 0.4s ease-out ${0.05 * index}s both`
//         }}
//       >
//         <ProviderCard provider={provider} mode={mode} />
//       </div>
//     ))}
//   </div>
// ));

// const PaginationButton = memo(({
//   onClick,
//   disabled,
//   icon: Icon,
//   label
// }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={`p-2 rounded-lg border transition-all ${disabled
//       ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
//       : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'
//       }`}
//     aria-label={label}
//   >
//     <Icon className="w-5 h-5" />
//   </button>
// ));

// const PageNumberButton = memo(({ pageNum, isActive, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`min-w-[40px] h-10 px-3 rounded-lg transition-all font-medium ${isActive
//       ? 'bg-blue-600 text-white shadow-md scale-105'
//       : 'text-gray-700 hover:bg-gray-100'
//       }`}
//   >
//     {pageNum}
//   </button>
// ));

// const DesktopPagination = memo(({ totalPages, currentPage, onPageChange }) => {
//   const pageNumbers = useMemo(() =>
//     generatePageNumbers(totalPages, currentPage),
//     [totalPages, currentPage]
//   );

//   return (
//     <div className="hidden md:flex items-center gap-1">
//       {pageNumbers.map((pageNum) => (
//         <PageNumberButton
//           key={pageNum}
//           pageNum={pageNum}
//           isActive={currentPage === pageNum}
//           onClick={() => onPageChange(pageNum)}
//         />
//       ))}
//     </div>
//   );
// });

// const MobilePagination = memo(({ currentPage, totalPages }) => (
//   <div className="md:hidden px-4 py-2 bg-gray-100 rounded-lg">
//     <span className="text-sm font-medium text-gray-700">
//       {currentPage} / {totalPages}
//     </span>
//   </div>
// ));

// const PaginationInfo = memo(({ startIndex, endIndex, total }) => (
//   <div className="text-sm text-gray-600 order-2 sm:order-1">
//     Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
//     <span className="font-semibold">{Math.min(endIndex, total)}</span>{' '}
//     of <span className="font-semibold">{total}</span> providers
//   </div>
// ));

// const Pagination = memo(({
//   totalPages,
//   currentPage,
//   startIndex,
//   endIndex,
//   totalProviders,
//   onPageChange
// }) => {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50">
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <PaginationInfo
//           startIndex={startIndex}
//           endIndex={endIndex}
//           total={totalProviders}
//         />

//         <div className="flex items-center gap-2 order-1 sm:order-2">
//           <PaginationButton
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             icon={ChevronLeft}
//             label="Previous page"
//           />

//           <DesktopPagination
//             totalPages={totalPages}
//             currentPage={currentPage}
//             onPageChange={onPageChange}
//           />

//           <MobilePagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//           />

//           <PaginationButton
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             icon={ChevronRight}
//             label="Next page"
//           />
//         </div>
//       </div>
//     </div>
//   );
// });

// // ==================== MAIN COMPONENT ====================
// const ServiceProviders = ({
//   filteredProviders = [],
//   selectedServices,
//   selectedCommunicationMethods,
//   onModeChange
// }) => {
//   const [activeTab, setActiveTab] = useState('chat');
//   const [currentPage, setCurrentPage] = useState({
//     chat: 1,
//     call: 1,
//     video: 1,
//     visit: 1
//   });

//   // Memoized values
//   const visibleTabs = useMemo(() =>
//     getVisibleTabs(selectedCommunicationMethods),
//     [selectedCommunicationMethods]
//   );

//   const activeTabData = useMemo(() =>
//     TABS_CONFIG.find(t => t.id === activeTab),
//     [activeTab]
//   );

//   const { totalPages, startIndex, endIndex } = useMemo(() =>
//     calculatePagination(filteredProviders.length, currentPage[activeTab] || 1),
//     [filteredProviders.length, currentPage, activeTab]
//   );

//   const paginatedProviders = useMemo(() =>
//     filteredProviders.slice(startIndex, endIndex),
//     [filteredProviders, startIndex, endIndex]
//   );

//   // Callbacks
//   const handlePageChange = useCallback((newPage) => {
//     setCurrentPage(prev => ({ ...prev, [activeTab]: newPage }));
//   }, [activeTab]);

//   const handleTabChange = useCallback((tabId) => {
//     setActiveTab(tabId);
//   }, []);

//   // Effects
//   useEffect(() => {
//     if (visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
//       setActiveTab(visibleTabs[0].id);
//     }
//   }, [visibleTabs, activeTab]);

//   useEffect(() => {
//     if (onModeChange && activeTabData?.mode) {
//       onModeChange(activeTabData.mode);
//     }
//   }, [activeTabData, onModeChange]);

//   return (
//     <div className="w-full bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* --------------------------
//             STICKY Tabs Navigation
//             -------------------------- */}
//         <div className="relative">
//           <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//             {/* pad horizontally to align with outer container */}
//             <div className="px-4 md:px-6">
//               <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
//                 {visibleTabs.map((tab) => (
//                   <TabButton
//                     key={tab.id}
//                     tab={tab}
//                     isActive={activeTab === tab.id}
//                     onClick={() => handleTabChange(tab.id)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 flex flex-col mt-0">
//           {/* Providers List */}
//           <div className="p-4 md:p-4 flex-1">
//             {paginatedProviders.length > 0 ? (
//               <ProviderGrid
//                 providers={paginatedProviders}
//                 activeTab={activeTab}
//                 mode={activeTabData?.mode || activeTab}
//               />
//             ) : (
//               <EmptyState activeTabData={activeTabData} />
//             )}
//           </div>

//           {/* Pagination */}
//           {paginatedProviders.length > 0 && (
//             <Pagination
//               totalPages={totalPages}
//               currentPage={currentPage[activeTab] || 1}
//               startIndex={startIndex}
//               endIndex={endIndex}
//               totalProviders={filteredProviders.length}
//               onPageChange={handlePageChange}
//             />
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }

//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default memo(ServiceProviders);






import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Phone, Video, MapPin, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import ProviderCard from './ProviderCard';

// ==================== CONSTANTS ====================
const ITEMS_PER_PAGE = 25;

const TABS_CONFIG = [
  { id: 'chat', label: 'Discreet Chat', icon: MessageCircle, filter: 'chat', mode: 'chat' },
  { id: 'visit', label: 'In-Person Visit', icon: MapPin, filter: 'home-visit', mode: 'visit' },
  { id: 'call', label: 'Discreet Audio Call', icon: Phone, filter: 'voice-call', mode: 'call' },
  { id: 'video', label: 'Discreet Video Call', icon: Video, filter: 'video-chat', mode: 'video' },
];

// ==================== UTILITY FUNCTIONS ====================
const getVisibleTabs = (selectedCommunicationMethods) => {
  if (!selectedCommunicationMethods) return TABS_CONFIG;

  if (selectedCommunicationMethods === 'call') {
    return TABS_CONFIG.filter(tab =>
      ['voice-call', 'video-chat'].includes(tab.filter)
    );
  }

  return TABS_CONFIG.filter(tab => tab.filter === selectedCommunicationMethods);
};

const calculatePagination = (providersCount, currentPage) => {
  const totalPages = Math.ceil(providersCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return { totalPages, startIndex, endIndex };
};

const generatePageNumbers = (totalPages, currentPage) => {
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return Array.from({ length: maxVisible }, (_, i) => i + 1);
  }

  if (currentPage >= totalPages - 3) {
    return Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + i + 1);
  }

  return Array.from({ length: maxVisible }, (_, i) => currentPage - 3 + i);
};

// ==================== SUB-COMPONENTS ====================
const TabButton = memo(({ tab, isActive, onClick }) => {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-3 px-4 py-2 min-w-[140px] rounded-lg whitespace-nowrap transition-all duration-200
        ${isActive
          ? 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 font-semibold'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
      `}
      aria-pressed={isActive}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'scale-105' : ''} transition-transform`} />
      <span className="text-sm md:text-base">{tab.label}</span>
      {isActive && <span className="ml-1 w-2 h-2 rounded-full bg-blue-600 inline-block" />}
    </button>
  );
});

const EmptyState = memo(({ activeTabData }) => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        {activeTabData && <activeTabData.icon className="w-10 h-10 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">No providers found</h3>
      <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
    </div>
  </div>
));

const ProviderGrid = memo(({ providers, activeTab, mode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {providers.map((provider, index) => (
      <div
        key={`${activeTab}-${provider._id}`}
        className="opacity-0"
        style={{
          animation: `fadeInUp 0.4s ease-out ${0.05 * index}s both`
        }}
      >
        <ProviderCard provider={provider} mode={mode} />
      </div>
    ))}
  </div>
));

const PaginationButton = memo(({ onClick, disabled, icon: Icon, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg border transition-all ${disabled
      ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
      : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'
      }`}
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
  </button>
));

const PageNumberButton = memo(({ pageNum, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`min-w-[40px] h-10 px-3 rounded-lg transition-all font-medium ${isActive
      ? 'bg-blue-600 text-white shadow-md scale-105'
      : 'text-gray-700 hover:bg-gray-100'
      }`}
  >
    {pageNum}
  </button>
));

const DesktopPagination = memo(({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = useMemo(() =>
    generatePageNumbers(totalPages, currentPage),
    [totalPages, currentPage]
  );

  return (
    <div className="hidden md:flex items-center gap-1">
      {pageNumbers.map((pageNum) => (
        <PageNumberButton
          key={pageNum}
          pageNum={pageNum}
          isActive={currentPage === pageNum}
          onClick={() => onPageChange(pageNum)}
        />
      ))}
    </div>
  );
});

const MobilePagination = memo(({ currentPage, totalPages }) => (
  <div className="md:hidden px-4 py-2 bg-gray-100 rounded-lg">
    <span className="text-sm font-medium text-gray-700">
      {currentPage} / {totalPages}
    </span>
  </div>
));

const PaginationInfo = memo(({ startIndex, endIndex, total }) => (
  <div className="text-sm text-gray-600 order-2 sm:order-1">
    Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
    <span className="font-semibold">{Math.min(endIndex, total)}</span>{' '}
    of <span className="font-semibold">{total}</span> providers
  </div>
));

const Pagination = memo(({
  totalPages,
  currentPage,
  startIndex,
  endIndex,
  totalProviders,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="border-t border-gray-200 px-4 md:px-6 py-4 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <PaginationInfo
          startIndex={startIndex}
          endIndex={endIndex}
          total={totalProviders}
        />

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={ChevronLeft}
            label="Previous page"
          />

          <DesktopPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />

          <MobilePagination
            currentPage={currentPage}
            totalPages={totalPages}
          />

          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={ChevronRight}
            label="Next page"
          />
        </div>
      </div>
    </div>
  );
});

// ==================== MAIN COMPONENT ====================
const ServiceProviders = ({
  filteredProviders = [],
  selectedServices,
  selectedCommunicationMethods,
  onModeChange
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentPage, setCurrentPage] = useState({
    chat: 1,
    call: 1,
    video: 1,
    visit: 1
  });

  const visibleTabs = useMemo(() =>
    getVisibleTabs(selectedCommunicationMethods),
    [selectedCommunicationMethods]
  );

  const activeTabData = useMemo(() =>
    TABS_CONFIG.find(t => t.id === activeTab),
    [activeTab]
  );

  // ⭐⭐⭐ ADDED — FILTER FEMALE PROVIDERS FOR VISIT MODE ⭐⭐⭐
  const mode = activeTabData?.mode || activeTab;
  const genderFilteredProviders = useMemo(() => {
    if (mode === "visit") {
      return filteredProviders.filter(
        p => p?.personalInfo?.gender !== "Female"
      );
    }
    return filteredProviders;
  }, [filteredProviders, mode]);

  // ⭐⭐⭐ UPDATED — USE genderFilteredProviders FOR PAGINATION ⭐⭐⭐
  const { totalPages, startIndex, endIndex } = useMemo(() =>
    calculatePagination(genderFilteredProviders.length, currentPage[activeTab] || 1),
    [genderFilteredProviders.length, currentPage, activeTab]
  );

  const paginatedProviders = useMemo(() =>
    genderFilteredProviders.slice(startIndex, endIndex),
    [genderFilteredProviders, startIndex, endIndex]
  );

  // Callbacks
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(prev => ({ ...prev, [activeTab]: newPage }));
  }, [activeTab]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Effects
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  useEffect(() => {
    if (onModeChange && activeTabData?.mode) {
      onModeChange(activeTabData.mode);
    }
  }, [activeTabData, onModeChange]);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* --------------------------
            STICKY Tabs Navigation
        -------------------------- */}
        <div className="relative">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="px-4 md:px-6">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
                {visibleTabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 flex flex-col mt-0">
          <div className="p-4 md:p-4 flex-1">
            {paginatedProviders.length > 0 ? (
              <ProviderGrid
                providers={paginatedProviders}
                activeTab={activeTab}
                mode={mode}
              />
            ) : (
              <EmptyState activeTabData={activeTabData} />
            )}
          </div>

          {paginatedProviders.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage[activeTab] || 1}
              startIndex={startIndex}
              endIndex={endIndex}
              totalProviders={genderFilteredProviders.length}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default memo(ServiceProviders);

