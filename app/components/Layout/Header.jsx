export default function Header() {
  return (
    <header className="bg-gray-900 p-3 md:p-4 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-gray-700/50">
      <div className="flex items-center flex-shrink-0">
        <img src="/images/logo.svg" alt="CrazyGames" className="h-8 w-auto mr-2" />
        <span className="ml-1 font-bold text-lg text-white hidden sm:inline">CrazyGames</span>
      </div>
      <div className="flex-1 mx-4 md:mx-6 max-w-lg">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-700 transition"
            placeholder="Rechercher des jeux..."
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </div>
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