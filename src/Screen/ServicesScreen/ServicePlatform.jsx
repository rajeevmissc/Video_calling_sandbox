import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { X, Filter } from 'lucide-react';
import { useLocation, useSearchParams } from "react-router-dom";
import ServiceFilters from './ServiceFilters';
import ServiceProviders from './ServiceProviders';
import { serviceCategories, getAllProviders } from '../../data/serviceData';
import { Helmet } from 'react-helmet-async';
// ==================== CONSTANTS ====================
const SKELETON_COUNT = 12;
const MOBILE_FILTER_MAX_WIDTH = '320px';

// ==================== UTILITY FUNCTIONS ====================
const getUrlParams = (location) => {
  const params = new URLSearchParams(location.search);
  console.log('params', params)
  return {
    skill: params.get("skill"),
    serviceType: location.state?.serviceType
  };
};



const matchesService = (provider, selectedService) => {
  const primaryService = provider.services?.primary?.toLowerCase() || '';
  const secondaryServices = (provider.services?.secondary || [])
    .map(s => s.toLowerCase());

  const selected = selectedService.toLowerCase();

  return (
    primaryService === selected ||
    secondaryServices.includes(selected)
  );
};

const matchesSearchQuery = (provider, searchQuery) => {
  if (!searchQuery) return true;

  const name = provider.personalInfo?.fullName?.toLowerCase() || "";
  const primary = provider.services?.primary?.toLowerCase() || "";
  const secondary = (provider.services?.secondary || [])
    .map(s => s.toLowerCase());

  return (
    name.includes(searchQuery) ||
    primary.includes(searchQuery) ||
    secondary.some(s => s.includes(searchQuery))
  );
};

const filterProviders = (providers, selectedServices, searchQuery) => {
  let results = [...providers];

  // Filter by selected services
  if (selectedServices.size > 0) {
    results = results.filter((provider) => {
      for (const selected of selectedServices) {
        if (matchesService(provider, selected)) {
          return true;
        }
      }
      return false;
    });
  }

  // Filter by search query
  if (searchQuery) {
    results = results.filter((provider) =>
      matchesSearchQuery(provider, searchQuery)
    );
  }

  return results;
};

// ==================== SKELETON COMPONENTS ====================
const SkeletonCard = memo(() => (
  <div className="animate-pulse bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4 h-[350px]">
    <div className="h-40 bg-gray-200 rounded-xl" />
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="flex space-x-3 mt-4">
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
  </div>
));

const SkeletonLoader = memo(() => {
  const skeletons = useMemo(() => Array.from({ length: SKELETON_COUNT }), []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 w-full">
      {skeletons.map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
});

// ==================== FILTER BADGE COMPONENT ====================
const FilterBadge = memo(({ count }) => {
  if (count === 0) return null;

  return (
    <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
      {count}
    </span>
  );
});

// ==================== MOBILE FILTER BUTTON ====================
const MobileFilterButton = memo(({ onClick, selectedCount }) => (
  <div className="lg:hidden fixed bottom-6 right-6 z-50">
    <button
      onClick={onClick}
      className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
      aria-label="Open filters"
    >
      <Filter size={20} />
      <span className="font-medium">Filters</span>
      <FilterBadge count={selectedCount} />
    </button>
  </div>
));

// ==================== MOBILE DRAWER COMPONENTS ====================
const MobileDrawerOverlay = memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      onClick={onClose}
      aria-hidden="true"
    />
  );
});

const MobileDrawerHeader = memo(({ onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
    <h2 className="text-xl font-bold text-gray-800">Filters</h2>
    <button
      onClick={onClose}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Close filters"
    >
      <X size={24} className="text-gray-600" />
    </button>
  </div>
));

const MobileDrawerFooter = memo(({ onClose, resultCount }) => (
  <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
    <button
      onClick={onClose}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors active:scale-95"
    >
      Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
    </button>
  </div>
));

const MobileDrawer = memo(({
  isOpen,
  onClose,
  serviceCategories,
  selectedServices,
  setSelectedServices,
  skillTitle,
  currentMode,
  resultCount
}) => (
  <>
    <MobileDrawerOverlay isOpen={isOpen} onClose={onClose} />

    <div
      className={`lg:hidden fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ maxWidth: MOBILE_FILTER_MAX_WIDTH }}
    >
      <div className="h-full flex flex-col">
        <MobileDrawerHeader onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          <ServiceFilters
            serviceCategories={serviceCategories}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            skillTitle={skillTitle}
            currentMode={currentMode}
          />
        </div>

        <MobileDrawerFooter onClose={onClose} resultCount={resultCount} />
      </div>
    </div>
  </>
));

// ==================== DESKTOP SIDEBAR ====================
const DesktopSidebar = memo(({
  serviceCategories,
  selectedServices,
  setSelectedServices,
  skillTitle,
  currentMode
}) => (
  <div className="hidden lg:block">
    <ServiceFilters
      serviceCategories={serviceCategories}
      selectedServices={selectedServices}
      setSelectedServices={setSelectedServices}
      skillTitle={skillTitle}
      currentMode={currentMode}
    />
  </div>
));

// ==================== CUSTOM HOOKS ====================
const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await getAllProviders();

        if (isMounted) {
          setProviders(data || []);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  return { providers, loading, error };
};

const useFilteredProviders = (providers, selectedServices, searchQuery) => {
  return useMemo(() => {
    return filterProviders(providers, selectedServices, searchQuery);
  }, [providers, selectedServices, searchQuery]);
};

const useMobileFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
};

// ==================== MAIN COMPONENT ====================
const ServicePlatform = () => {
  // URL and search params
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { skill, serviceType } = useMemo(() =>
    getUrlParams(location),
    [location]
  );

  console.log('serviceType', serviceType);

  const searchQuery = useMemo(() =>
    searchParams.get("search")?.toLowerCase() || "",
    [searchParams]
  );

  // State
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [currentMode, setCurrentMode] = useState('chat');

  // Custom hooks
  const { providers, loading, error } = useProviders();
  const mobileFilter = useMobileFilter();

  const filteredProviders = useFilteredProviders(
    providers,
    selectedServices,
    searchQuery
  );

  // Callbacks
  const handleModeChange = useCallback((mode) => {
    setCurrentMode(mode);
  }, []);

  // Memoized values
  const selectedServicesCount = useMemo(() =>
    selectedServices.size,
    [selectedServices]
  );

  const resultCount = useMemo(() =>
    filteredProviders.length,
    [filteredProviders]
  );

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            Unable to load providers. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Browse Companionship Services | Verified Happiness Executives</title>
        <meta name="description" content="Find verified companions offering chat, audio/video sessions, emotional support and activity-based companionship." />
        <meta name="keywords" content="companions India, emotional guidance booking, chat support India, video support service" />

        <meta property="og:title" content="Browse Available Services" />
        <meta property="og:description" content="Browse Available Services" />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Filter Button */}
        <MobileFilterButton
          onClick={mobileFilter.open}
          selectedCount={selectedServicesCount}
        />

        <div className="flex">
          {/* Desktop Sidebar */}
          <DesktopSidebar
            serviceCategories={serviceCategories}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            skillTitle={skill}
            currentMode={currentMode}
          />

          {/* Mobile Drawer */}
          <MobileDrawer
            isOpen={mobileFilter.isOpen}
            onClose={mobileFilter.close}
            serviceCategories={serviceCategories}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            skillTitle={skill}
            currentMode={currentMode}
            resultCount={resultCount}
          />

          {/* Main Content Area */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <ServiceProviders
              filteredProviders={filteredProviders}
              selectedServices={selectedServices}
              selectedCommunicationMethods={serviceType}
              onModeChange={handleModeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ServicePlatform;

