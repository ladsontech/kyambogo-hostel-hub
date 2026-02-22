import { useState, useEffect, KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const TOP_SEARCHES = [
  "Search modern hostels near you...",
  "Search modern features & amenities...",
  "Search services for accessing hostels...",
  "Ask Tamu AI about the best hostels...",
  "Search Flamia gas services...",
];

export const AnimatedSearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % TOP_SEARCHES.length);
        setFade(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/hostels?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/hostels');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-[460px] relative items-center h-10 rounded-full border-2 border-[#1B4FA8] bg-[#1B4FA8] overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* White input container — curved on the left */}
      <div className="relative flex-1 h-full flex items-center bg-white rounded-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="w-full h-full rounded-full pl-5 pr-3 outline-none text-sm text-gray-700 font-normal z-10 relative bg-transparent"
        />
        {!searchQuery && (
          <div className="absolute left-5 pointer-events-none w-[85%] h-full flex items-center z-0 overflow-hidden">
            <span
              key={placeholderIndex}
              style={{
                opacity: fade ? 1 : 0,
                transform: fade ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
              className="text-gray-400 font-normal text-sm whitespace-nowrap"
            >
              {TOP_SEARCHES[placeholderIndex]}
            </span>
          </div>
        )}
      </div>
      {/* Blue search button — curved on the right */}
      <button 
        onClick={handleSearch}
        className="w-14 h-full flex items-center justify-center text-white hover:bg-[#1B4FA8]/80 transition-colors z-20 flex-shrink-0"
      >
        <Search className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
