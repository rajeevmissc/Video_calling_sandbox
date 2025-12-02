

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

// ==================== CONSTANTS ====================
const SKILL_AVAILABILITY = {
  'All': ['All'],
  "Communication & Emotional Support": {
    "Active listening": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Empathy training": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Motivational speaking": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Public speaking": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Cross-cultural communication": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Stress counseling (non-clinical)": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Break-up support": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Conversational English practice": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" }
  },
  "Arts, Music & Creative Expression": {
    "Singing (Bollywood songs)": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Guitar playing": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Painting (acrylics, oils)": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Sketching & doodling": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Calligraphy": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Poetry recitation (Hindi/Urdu/Kavita)": { chat: "Yes", call: "No", video: "Yes", visit: "Yes" },
    "Creative writing coach": { chat: "Yes", call: "No", video: "Yes", visit: "Yes" },
    "Theatre/acting games": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Storytelling for kids": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
  },
  "Reading & Knowledge Sharing": {
    "Reading books aloud": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "History talks (Indian history)": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Mythology storytelling (Ramayana/Mahabharata)": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Current affairs discussion": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Spirituality talks": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Philosophy basics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
  },
  "Sports & Physical Activities": {
    "Carrom partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Table tennis partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Badminton partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Cricket net practice buddy": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Football buddy": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Volleyball partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Kabaddi partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Running/jogging companion": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Cycling buddy": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Yoga partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Zumba fitness partner": { chat: "No", call: "No", video: "No", visit: "Yes" },
    "Walking companion": { chat: "No", call: "No", video: "No", visit: "Yes" }
  },
  "Games & Entertainment": {
    "Ludo": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Snakes & ladders": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Monopoly": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Cards (Rummy, UNO)": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Puzzles (Sudoku, logic)": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "Gaming (PlayStation/Xbox)": { chat: "No", call: "No", video: "Yes", visit: "Yes" },
    "PC gaming (FIFA, Counter-Strike)": { chat: "No", call: "No", video: "Yes", visit: "Yes" }
  },
  "Education & Skill Development": {
    "Computer basics": { chat: "Yes", call: "No", video: "Yes", visit: "Yes" },
    "MS Office training": { chat: "Yes", call: "No", video: "Yes", visit: "Yes" },
    "Smartphone literacy for elders": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Social media basics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Digital payments guidance": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Resume writing help": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Job interview practice": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Public speaking practice": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Financial literacy basics": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Goal setting & planning": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Basic coding (Scratch, Python)": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" }
  },
  "Lifestyle & Practical Help": {
    "Cooking simple Indian meals": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Baking cakes/cookies": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Tea/coffee making rituals": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Gardening basics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Pet care & dog walking": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Grocery shopping companion": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Wardrobe organizing": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Home decoration ideas": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Festival celebration guide (Diwali, Holi)": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" }
  },
  "Social & Cultural Engagement": {
    "Bollywood dance": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Classical dance (Kathak, Bharatanatyam)": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Folk dance (Bhangra, Garba)": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Karaoke nights": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Movie discussion club": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "TV serial gossip": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Museum companion": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
    "Temple/mosque/gurudwara companion": { chat: "No", call: "Yes", video: "Yes", visit: "Yes" },
  },
  "Emotional Well-being & Mindfulness": {
    "Life reflections sharing": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Bucket list planning buddy": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" }
  },
    "Political & Social Discussions": {
    "Discussion on Modi - Politics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Discussion on Rahul Gandhi - Politics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Discussion on Mamta Banerjee - Politics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
    "Discussion on Saas-Bahu topic - Politics": { chat: "Yes", call: "Yes", video: "Yes", visit: "Yes" },
  }
};

// ---------------- ROUND CHECKMARK ----------------
const RoundCheckbox = ({ checked }) => (
  <span
    className={`w-4 h-4 rounded-full border flex items-center justify-center transition
    ${checked ? "border-black bg-black" : "border-gray-400 bg-white"}`}
  >
    {checked && <span className="w-2 h-2 bg-white rounded-full"></span>}
  </span>
);

// ---------------- Service Item Row ----------------
const ServiceRow = memo(({ service, isChecked, onChange }) => (
  <div
    onClick={() => onChange(service, !isChecked)}
    className="flex items-center gap-3 cursor-pointer py-1.5"
  >
    <RoundCheckbox checked={isChecked} />
    <span className="text-sm text-gray-700">{service}</span>
  </div>
));

// ---------------- Category Block ----------------
const CategoryItem = memo(
  ({
    category,
    services,
    selectedServices,
    isExpanded,
    onToggleCategory,
    onServiceToggle,
  }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div
          onClick={onToggleCategory}
          className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-gray-800">{category}</h3>

          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-700" />
          )}
        </div>

        {/* Services */}
        {isExpanded && (
          <div className="px-4 py-3 space-y-1">
            {services.map((service) => (
              <ServiceRow
                key={service}
                service={service}
                isChecked={selectedServices.has(service)}
                onChange={onServiceToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

// ---------------- MAIN COMPONENT ----------------
const ServiceFilters = ({
  selectedServices,
  setSelectedServices,
  currentMode = "chat",
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Filter services by mode
  const serviceCategories = useMemo(() => {
    const filtered = {};
    for (const [category, items] of Object.entries(SKILL_AVAILABILITY)) {
      if (category === "All") continue;

      const available = Object.entries(items)
        .filter(([_, modes]) => modes[currentMode] === "Yes")
        .map(([service]) => service);

      if (available.length > 0) filtered[category] = available;
    }
    return filtered;
  }, [currentMode]);

  // expand all on load
  useEffect(() => {
    setExpandedCategories(new Set(Object.keys(serviceCategories)));
  }, [serviceCategories]);

  // toggle a service
  const handleServiceToggle = useCallback(
    (service, isChecked) => {
      const newSel = new Set(selectedServices);
      isChecked ? newSel.add(service) : newSel.delete(service);
      setSelectedServices(newSel);
    },
    [selectedServices, setSelectedServices]
  );

  // toggle category open/close
  const toggleCategory = useCallback(
    (category) => {
      const updated = new Set(expandedCategories);
      updated.has(category)
        ? updated.delete(category)
        : updated.add(category);
      setExpandedCategories(updated);
    },
    [expandedCategories]
  );

  return (
    <div className="bg-[#F3F3F3] p-5 rounded-2xl space-y-6 overflow-y-auto">
      {/* ---------------- Availability ---------------- */}
      {/* <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Availability</p>

        <div className="flex gap-2">
          {["All", "Online", "Offline"].map((tab, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-xl text-sm border 
                ${
                  idx === 0
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div> */}

      {/* ---------------- Category List ---------------- */}
      <div className="space-y-4">
        {Object.entries(serviceCategories).map(([category, services]) => (
          <CategoryItem
            key={category}
            category={category}
            services={services}
            selectedServices={selectedServices}
            isExpanded={expandedCategories.has(category)}
            onToggleCategory={() => toggleCategory(category)}
            onServiceToggle={handleServiceToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ServiceFilters);

