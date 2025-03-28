import { useLocation } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Handle navigation with a direct URL approach for game pages
  const handleNavigation = (path) => {
    const isOnGamePage = location.pathname.includes('/games/');
    
    if (isOnGamePage) {
      // Use direct window.location approach for reliable navigation
      window.location.href = path;
    } else {
      // Use client-side navigation for non-game pages
      window.location.href = path;
    }
  };

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the suggestions fetch
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNavigation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  // Navigate to a suggestion
  const handleSuggestionClick = (suggestionId) => {
    handleNavigation(`/games/${suggestionId}`);
    setShowSuggestions(false);
  };
  
  return (
    <header className="bg-gray-900 p-3 md:p-4 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-gray-700/50">
      <div className="flex items-center flex-shrink-0">
        <button 
          onClick={() => handleNavigation('/')}
          className="flex items-center focus:outline-none"
        >
          <img src="/images/logo.svg" alt="CrazyGames" className="h-8 w-auto mr-2" />
          <span className="ml-1 font-bold text-lg text-white hidden sm:inline">CrazyGames</span>
        </button>
      </div>
      <div className="flex-1 mx-4 md:mx-6 max-w-lg">
        <div className="relative">
          <form onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-700 transition"
              placeholder="Rechercher des jeux..."
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <svg className="animate-spin w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              )}
            </div>
          </form>
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full mt-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto"
            >
              {suggestions.map(suggestion => (
                <button
                  key={suggestion.id}
                  className="flex items-center w-full p-2 hover:bg-gray-700 text-left"
                  onClick={() => handleSuggestionClick(suggestion.id)}
                >
                  {suggestion.image && (
                    <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-700 rounded overflow-hidden">
                      <img src={suggestion.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-white text-sm font-medium">{suggestion.title}</div>
                    <div className="text-gray-400 text-xs">{suggestion.category}</div>
                  </div>
                </button>
              ))}
              <div className="p-2 border-t border-gray-700">
                <button 
                  className="w-full text-center text-indigo-400 text-sm hover:text-indigo-300"
                  onClick={handleSearchSubmit}
                >
                  Voir tous les résultats pour &quot;{searchQuery}&quot;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition text-gray-300 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
        </button>
        <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition text-gray-300 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
          </svg>
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-md transition-colors font-medium">Connexion</button>
      </div>
    </header>
  );
} 