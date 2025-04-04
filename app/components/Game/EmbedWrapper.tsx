import { useState, useRef, useEffect } from 'react';
import { Game } from '~/services/gameService';

interface EmbedWrapperProps {
  game?: Partial<Game>;
}

export default function EmbedWrapper({ game }: EmbedWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    if (!game?.embed || !embedContainerRef.current) return;

    const isHtmlEmbed = game.embed.includes('<div>') || game.embed.includes('<script');
    if (!isHtmlEmbed) return;
    
    try {
      embedContainerRef.current.innerHTML = game.embed;
      
      const scripts = embedContainerRef.current.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = oldScript.innerHTML;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    } catch (error) {
      // Silent error handling
    }
  }, [game?.embed]);
  
  // If no game provided, silently return empty div
  if (!game?.id || !game?.embed) {
    return <div className="hidden"></div>;
  }

  const isHtmlEmbed = game.embed.includes('<div>') || game.embed.includes('<script');

  const toggleFullscreen = () => {
    const element = isHtmlEmbed ? embedContainerRef.current : iframeRef.current;
    if (!document.fullscreenElement && element) {
      element.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  
  return (
    <div className="relative bg-black w-full h-full flex flex-col">
      {/* Game header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${game.color || 'bg-blue-600'}`}>
            <span className="text-white font-bold">
              {game.title?.substring(0, 1) || '?'}
            </span>
          </div>
          <h2 className="text-white font-bold ml-2">
            {game.title || 'Unknown Game'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v4a1 1 0 01-1 1H2a1 1 0 010-2h.01L2 7.01V6a1 1 0 111-1h1a1 1 0 110 2H3.99L4 7.01V5a1 1 0 011-1h4a1 1 0 110 2H5V4zm7 0a1 1 0 011 1v1.01L13.01 5H15a1 1 0 110 2h-1a1 1 0 01-1-1V5a1 1 0 011-1h4a1 1 0 011 1v2.01L19.01 8H17a1 1 0 110-2h1.01L18 5.01V5a1 1 0 011-1h1a1 1 0 110 2h-.01L20 7.01V11a1 1 0 01-1 1h-4a1 1 0 01-1-1v-.01L14.01 11H13a1 1 0 110-2h1a1 1 0 011 1v.01L15.01 9H16a1 1 0 001-1V4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Game embed content */}
      <div className="flex-grow relative">
        {isHtmlEmbed ? (
          <div 
            ref={embedContainerRef}
            className="w-full h-full bg-white overflow-hidden"
          ></div>
        ) : (
          <iframe
            ref={iframeRef}
            src={game.embed}
            title={`Play ${game.title || 'Game'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
} 