import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_PROVIDERS, ALL_SERVICES } from './HeaderData';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = query.toLowerCase();

    const matchScore = (text) => {
      const t = text.toLowerCase();
      if (t.startsWith(lower)) return 6;
      if (t.split(" ").some(word => word.startsWith(lower))) return 4;
      if (t.includes(lower)) return 2;
      return 0;
    };

    const rankedMatches = (list, type) =>
      list
        .map((item) => ({ name: item, type, score: matchScore(item) }))
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    const serviceMatches = rankedMatches(ALL_SERVICES, "Service");
    const providerMatches = rankedMatches(DUMMY_PROVIDERS, "Provider");

    const combined = [...serviceMatches, ...providerMatches].slice(0, 8);

    setSuggestions(combined);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative hidden lg:flex items-center w-56">
      <Search
        size={18}
        className="absolute left-3 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search providers or services..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        value={searchQuery}
        onChange={(e) => {
          const val = e.target.value;
          setSearchQuery(val);
          fetchSuggestions(val);
        }}
        onFocus={() => searchQuery && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-56 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer flex justify-between"
              onMouseDown={() => {
                setSearchQuery(item.name);
                setShowSuggestions(false);
                navigate(`/services?search=${encodeURIComponent(item.name)}`);
              }}
            >
              <span>{item.name}</span>
              <span className="text-gray-400 text-xs">{item.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;